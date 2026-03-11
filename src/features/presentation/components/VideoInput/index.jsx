import React from 'react';
import './styles.css';

const VideoInput = ({ label, id, onChange, selectedFile }) => {
  return (
    <div className="video-input">
      <div className="video-input-wrapper">
        <input
          id={id}
          type="file"
          accept="video/*"
          onChange={onChange}
          aria-label={`Choose ${label.toLowerCase()}`}
          title={`Choose ${label.toLowerCase()}`}
          className="video-input-field"
        />
        <div className="video-input-button">{label}</div>
      </div>
      {selectedFile && (
        <div  className="video-input-file-info" >
          <span className="file-name">{selectedFile.name}</span>
          <span className="file-size">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
        </div>
      )}
    </div>
  );
};

export default VideoInput;