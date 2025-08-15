// src/components/InputForm.jsx

import React from 'react';

// Receive the new buttonText prop
function InputForm({ articleUrl, onUrlChange, handleSubmit, isLoading, urlError, buttonText }) {
  const isButtonDisabled = isLoading || (!!urlError && !!articleUrl);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="input-form" noValidate>
        <input
          type="text" 
          placeholder="https://..."
          value={articleUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          className={urlError ? 'input-error' : ''}
          required
        />
        {/* Use the buttonText prop here instead of a hardcoded string */}
        <button type="submit" disabled={isButtonDisabled}>
          {buttonText}
        </button>
      </form>
      {urlError && <p className="url-error-message">{urlError}</p>}
    </div>
  );
}

export default InputForm;