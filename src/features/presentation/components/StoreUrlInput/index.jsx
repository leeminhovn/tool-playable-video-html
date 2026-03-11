import React, { useState } from 'react';
import './styles.css';

const StoreUrlInput = ({ label, id, onChange, placeholder }) => {
  const [error, setError] = useState('');

  const validateUrl = (url, type) => {
    if (!url) return '';
    
    const patterns = {
      chplay: /^https:\/\/play\.google\.com\/store\/apps\/details\?id=[\w\d\.]+$/,
      appstore: /^https:\/\/apps\.apple\.com\/.+\/app\/.+\/id\d+$/
    };

    return patterns[type].test(url) ? '' : `Invalid ${type === 'chplay' ? 'Google Play' : 'App Store'} URL format`;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const type = id.includes('chplay') ? 'chplay' : 'appstore';
    const error = validateUrl(value, type);
    setError(error);
    onChange(value, !error);
  };

  return (
    <div className="store-url-input">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="url"
        onChange={handleChange}
        placeholder={placeholder}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default StoreUrlInput;