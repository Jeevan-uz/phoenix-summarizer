// src/components/InputForm.jsx

import React from 'react';
import AnimatedButton from './AnimatedButton'; // Import our new button
import ErrorMessage from './ErrorMessage';

function InputForm({ articleUrl, onUrlChange, handleSubmit, isLoading, urlError }) {
  const isButtonDisabled = isLoading || !articleUrl || !!urlError;

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
        {/* Replace the old button with our new animated one */}
        <AnimatedButton isLoading={isLoading} isDisabled={isButtonDisabled} />
      </form>
      <ErrorMessage message={urlError} />
    </div>
  );
}

export default InputForm;