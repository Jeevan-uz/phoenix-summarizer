import React, { useState } from 'react';
import ErrorMessage from './ErrorMessage';

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
    };

    const getScoreColorClass = (score) => {
        if (score >= 75) return 'score-high';
        if (score >= 40) return 'score-medium';
        return 'score-low';
    };
  
    return (
        <div className="results-container">
            <div className="results-header">
                <h2 className="results-title">Analysis Results</h2>
                <div className="clear-container">
                    <button onClick={onClear} className="clear-button">Clear Results</button>
                </div>
            </div>

           {error && <ErrorMessage message={error} />}

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
                            <p className={`accuracy-score-large ${getScoreColorClass(result.accuracy_score)}`}>
                                {result.accuracy_score}<span>/100</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResultDisplay;