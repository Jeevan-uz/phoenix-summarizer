// src/App.jsx

import React, { useState } from 'react'; // useEffect is no longer needed here
import './index.css';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [articleUrl, setArticleUrl] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');

  // The old useEffect for "Summarizing..." animation is now removed.

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/summarize';

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  };
  
  const handleUrlChange = (newUrl) => {
    setArticleUrl(newUrl);
    if (newUrl && !validateUrl(newUrl)) {
      setUrlError('Please enter a valid URL format (e.g., https://example.com).');
    } else {
      setUrlError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (urlError) return;

    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleUrl: articleUrl }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An unknown backend error occurred.');
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setArticleUrl('');
    setResult(null);
    setError('');
    setUrlError('');
  };

  return (
    <div className="container">
      <h1>Phoenix Article Summarizer</h1>
      <p className="subtitle">Enter the URL of an article to get a summary, key points, and an accuracy score.</p>
      
      {/* The InputForm component no longer needs a buttonText prop */}
      <InputForm 
        articleUrl={articleUrl}
        onUrlChange={handleUrlChange} 
        handleSubmit={handleSubmit}
        isLoading={isLoading} 
        urlError={urlError}
      />

      <ResultDisplay 
        result={result}
        error={error}
        handleClear={handleClear}
      />
    </div>
  );
}

export default App;