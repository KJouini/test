import React from 'react';

export default function TextField({
  label,
  helper,
  error,
  id,
  className = '',
  inputClassName = '',
  ...props
}) {
  const finalId = id || `tf-${Math.random().toString(36).slice(2)}`;
  const describedBy = error ? `${finalId}-error` : helper ? `${finalId}-helper` : undefined;
  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={finalId} className="tw-label">{label}</label>}
      <input
        id={finalId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`tw-input ${error ? 'tw-input--error' : ''} ${inputClassName}`}
        {...props}
      />
      {helper && !error && <div id={`${finalId}-helper`} className="tw-helper">{helper}</div>}
      {error && <div id={`${finalId}-error`} className="tw-error">{error}</div>}
    </div>
  );
}
