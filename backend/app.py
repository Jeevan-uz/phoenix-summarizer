# backend/app.py

import os
import json
import logging # <-- 1. Import the logging module
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

import google.generativeai as genai
from newspaper import Article, Config

load_dotenv()

app = Flask(__name__)
# In a real production environment, you would replace the "*" with your Vercel frontend URL
CORS(app, resources={r"/summarize": {"origins": "*"}}) 

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
    # Use logging for startup errors as well
    logging.basicConfig(level=logging.INFO)
    logging.error(f"FATAL: Could not configure Google AI. Error: {e}")


@app.route('/summarize', methods=['POST'])
@limiter.limit("10 per day") # A low limit for easy testing
def summarize():
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
            user_error = "Could not extract sufficient readable text from the article. The page may be a video, a PDF, or require a login."
            return jsonify({'error': user_error}), 400
        
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
        # This is a specific error for when the AI gives a bad response
        return jsonify({'error': 'The AI model returned an invalid format. Please try again.'}), 500
    
    # --- 2. THIS IS THE KEY CHANGE ---
    except Exception as e:
        # Log the detailed, technical error for our debugging purposes
        logging.error(f"Error processing URL: {article_url}. Exception: {e}")

        # Return a generic, user-friendly error message to the frontend
        user_friendly_error = "Could not process the article. The URL may be incorrect, the website may be down, or it might be blocking automated access."
        return jsonify({"error": user_friendly_error}), 500


@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify(error=f"Rate limit exceeded: {e.description}"), 429


if __name__ == '__main__':
    app.run(debug=True, port=5000)