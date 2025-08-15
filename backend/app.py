# backend/app.py

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

import google.generativeai as genai
from newspaper import Article, Config

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/summarize": {"origins": "http://localhost:5173"}})

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
config = Config()
config.browser_user_agent = user_agent
config.request_timeout = 15

try:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in .env file")
    genai.configure(api_key=api_key)
except Exception as e:
    print(f"Error configuring Google AI: {e}")


# --- We are using a low limit for easy testing ---
@app.route('/summarize', methods=['POST'])
@limiter.limit("10 per day")
def summarize():
    # ... (The summarize function itself is completely unchanged)
    data = request.get_json()
    article_url = data.get('articleUrl')

    if not article_url:
        return jsonify({'error': 'articleUrl is required'}), 400

    try:
        article = Article(article_url, config=config)
        article.download()
        article.parse()

        article_text = article.text
        if not article_text or len(article_text) < 200:
            return jsonify({'error': 'Could not extract sufficient article text.'}), 400
        
        prompt = f"""
        Analyze the following article text and return a single, valid JSON object.
        The JSON object must have the following three keys:
        1. "summary": A concise, one-paragraph summary of the article.
        2. "key_points": An array of 3 to 5 strings, where each string is a key takeaway or main point from the article.
        3. "accuracy_score": An integer between 0 and 100, representing your confidence in the factual accuracy of the article's content. Base this score on factors like the presence of sources, neutral language, and verifiable claims.
        Do not include any text, backticks, or formatting before or after the JSON object.
        --- ARTICLE TEXT ---
        {article_text}
        """

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        response_text = response.text.strip().replace('```json', '').replace('```', '')
        result_json = json.loads(response_text)
        return jsonify(result_json)

    except json.JSONDecodeError:
        return jsonify({'error': 'The AI model returned an invalid format. Please try again.'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to process the article. (Error: {str(e)})'}), 500

# --- NEW: Create a custom JSON error response for rate limiting ---
# The @app.errorhandler decorator registers a function to handle a specific error code.
# The code for "Too Many Requests" is 429.
@app.errorhandler(429)
def ratelimit_handler(e):
    # This function will now run instead of the default HTML page.
    # It returns a JSON object that our frontend can understand.
    return jsonify(error=f"Rate limit exceeded: {e.description}"), 429


if __name__ == '__main__':
    app.run(debug=True, port=5000)