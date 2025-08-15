// src/App.jsx

import React, { useState, useEffect } from 'react'; // <-- 1. Import useEffect
import './index.css';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [articleUrl, setArticleUrl] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [buttonText, setButtonText] = useState('Summarize'); // <-- 2. New state for button text

  // --- 3. NEW: useEffect hook for the loading animation ---
  useEffect(() => {
    let intervalId;

    if (isLoading) {
      // When loading starts, set up an interval to cycle the dots
      let dotCount = 1;
      setButtonText('Summarizing.'); // Set initial text

      intervalId = setInterval(() => {
        dotCount = (dotCount % 3) + 1; // Cycle from 1 to 3
        setButtonText(`Summarizing${'.'.repeat(dotCount)}`);
      }, 500); // Change text every 500ms
    } else {
      // When loading stops, reset the button text
      setButtonText('Summarize');
    }

    // This is the "cleanup" function. React runs this when the component
    // re-renders or unmounts, preventing memory leaks.
    return () => clearInterval(intervalId);

  }, [isLoading]); // This effect re-runs ONLY when the `isLoading` state changes

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

    // ... (rest of the handleSubmit function is unchanged) ...
    const backendUrl = 'http://localhost:5000/summarize';
    try {
      const fullUrl = articleUrl.startsWith('http') ? articleUrl : `https://`;
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleUrl: fullUrl }),
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
      
      <InputForm 
        articleUrl={articleUrl}
        onUrlChange={handleUrlChange} 
        handleSubmit={handleSubmit}
        isLoading={isLoading} 
        urlError={urlError}
        buttonText={buttonText} // <-- 4. Pass the new dynamic button text
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