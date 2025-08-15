// src/components/ResultDisplay.jsx

import React, { useState } from 'react';

function ResultDisplay({ result, error, handleClear }) {
  // State for the original summary copy button
  const [summaryCopyText, setSummaryCopyText] = useState('Copy');
  // <-- 1. NEW: Add state for our new key points copy button
  const [pointsCopyText, setPointsCopyText] = useState('Copy Points');
  
  if (!result && !error) {
    return null;
  }

  // This function remains the same, but we rename it for clarity
  const handleCopySummary = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary.trim());
    setSummaryCopyText('Copied!');
    setTimeout(() => {
      setSummaryCopyText('Copy');
    }, 2000);
  };
  
  // <-- 2. NEW: Add a dedicated function to copy only the key points
  const handleCopyPoints = () => {
    if (!result || !result.key_points) return;
    // Format the array of points into a single string with newlines
    const pointsText = result.key_points.map(point => `- ${point}`).join('\n');
    navigator.clipboard.writeText(pointsText);
    setPointsCopyText('Copied!');
    setTimeout(() => {
      setPointsCopyText('Copy Points');
    }, 2000);
  };
  
  const onClear = () => {
    handleClear();
    setSummaryCopyText('Copy');
    setPointsCopyText('Copy Points'); // <-- 3. NEW: Reset the new button's text on clear
  }

  return (
    <>
      <div className="clear-container">
        <button onClick={onClear} className="clear-button">Clear Results</button>
      </div>

      {error && (
        <div className="result-box error-box">
          <h2>An Error Occurred</h2>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-box summary-box">
          {/* Summary Section */}
          <div className="section-header"> {/* <-- 4. UPDATE: Use the new generic class name */}
            <h2>AI Summary</h2>
            <button onClick={handleCopySummary} className="copy-button">
              {summaryCopyText}
            </button>
          </div>
          <p>{result.summary}</p>
          
          {/* Key Points Section */}
          {/* <-- 5. NEW: Create a header for key points with the new button --> */}
          <div className="section-header">
            <h3 className="section-title">Key Points</h3>
            <button onClick={handleCopyPoints} className="copy-button">
              {pointsCopyText}
            </button>
          </div>

          <ul className="key-points-list">
            {result.key_points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>

          {/* Accuracy Score Section */}
          <div className="accuracy-section">
            <h3 className="section-title">Estimated Accuracy Score</h3>
            <div className="accuracy-score">{result.accuracy_score}/100</div>
          </div>
        </div>
      )}
    </>
  );
}

export default ResultDisplay;