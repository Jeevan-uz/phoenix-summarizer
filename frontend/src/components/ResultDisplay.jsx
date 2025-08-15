// FULL AND FINAL VERSION for src/components/ResultDisplay.jsx
import React, { useState } from 'react';

function ResultDisplay({ result, error, handleClear }) {
  const [summaryCopyText, setSummaryCopyText] = useState('Copy');
  const [pointsCopyText, setPointsCopyText] = useState('Copy Points');
  
  if (!result && !error) {
    return null;
  }

  const handleCopySummary = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary.trim());
    setSummaryCopyText('Copied!');
    setTimeout(() => { setSummaryCopyText('Copy'); }, 2000);
  };
  
  const handleCopyPoints = () => {
    if (!result || !result.key_points) return;
    const pointsText = result.key_points.map(point => `- ${point}`).join('\n');
    navigator.clipboard.writeText(pointsText);
    setPointsCopyText('Copied!');
    setTimeout(() => { setPointsCopyText('Copy Points'); }, 2000);
  };
  
  const onClear = () => {
    handleClear();
    setSummaryCopyText('Copy');
    setPointsCopyText('Copy Points');
  }

  return (
    <div className="results-container">
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
        <div className="cards-layout">
          <div className="result-card summary-card">
            <div className="section-header">
              <h2>AI Summary</h2>
              <button onClick={handleCopySummary} className="copy-button">{summaryCopyText}</button>
            </div>
            <p>{result.summary}</p>
          </div>

          <div className="side-cards-container">
            <div className="result-card points-card">
              <div className="section-header">
                <h3 className="section-title">Key Points</h3>
                <button onClick={handleCopyPoints} className="copy-button">{pointsCopyText}</button>
              </div>
              <ul className="key-points-list">
                {result.key_points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="result-card accuracy-card">
              <h3 className="section-title">Estimated Accuracy</h3>
              <p className="accuracy-score-large">{result.accuracy_score}<span>/100</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultDisplay;