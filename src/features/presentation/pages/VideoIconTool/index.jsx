import React, { useState } from 'react';
import VideoInput from '../../components/VideoInput';
import StoreUrlInput from '../../components/StoreUrlInput';
import './styles.css';
const keyToEditCorePlayable = "XXX_XX_X_X_XX_24_12_2004_DAO_CONG_KHA";
const ExportOption = {
  UNITY: 'unity',
  MINTEGRAL: 'mintegral',
  GOOGLE_AD: 'google_ad',
  APPLOVIN: 'applovin'
};


const VideoIconTool = () => {
  const [verticalVideo, setVerticalVideo] = useState(null);
  const [horizontalVideo, setHorizontalVideo] = useState(null);
  const [chplayUrl, setChplayUrl] = useState('');
  const [appstoreUrl, setAppstoreUrl] = useState('');
  const [isValidChplay, setIsValidChplay] = useState(false);
  const [isValidAppstore, setIsValidAppstore] = useState(false);
  const [sizeError, setSizeError] = useState('');
  const checkTotalSize = (vertical, horizontal) => {
    const totalSize = (vertical?.size || 0) + (horizontal?.size || 0);
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    
    if (totalSize > maxSize) {
      setSizeError('Total size of both videos cannot exceed 5MB');
      return false;
    }
    setSizeError('');
    return true;
  };

  const handleVerticalVideoChange = (e) => {
    const file = e.target.files[0];
    setVerticalVideo(file);
    checkTotalSize(file, horizontalVideo);
  };

  const handleHorizontalVideoChange = (e) => {
    const file = e.target.files[0];
    setHorizontalVideo(file);
    checkTotalSize(verticalVideo, file);
  };

  const handleExport = async (option) => {
    try {
      let templateFile = '';
      switch (option) {
        case ExportOption.UNITY:
          templateFile = '/unity_core_logic_playable_show.html';
          break;
        case ExportOption.MINTEGRAL:
          templateFile = '/mintegral_core_logic_playable_show.html';
          break;
        case ExportOption.GOOGLE_AD:
          templateFile = '/google_core_logic_playable_show.html';
          break;
        case ExportOption.APPLOVIN:
          templateFile = '/applovin_core_logic_playable_show.html';
          break;
        default:
          throw new Error('Invalid export option');
      }

      // Fetch the template file
      const response = await fetch(templateFile);
      let templateContent = await response.text();

      // Convert videos to base64
      const verticalBase64 = await fileToBase64(verticalVideo);
      const horizontalBase64 = await fileToBase64(horizontalVideo);

      templateContent = templateContent
        .replace(keyToEditCorePlayable, keyToEditCorePlayable)
        .replace(`${keyToEditCorePlayable}_KEY_VIDEO_L`, horizontalBase64)
        .replace(`${keyToEditCorePlayable}_KEY_VIDEO_P`, verticalBase64)
        .replace(`${keyToEditCorePlayable}_KEY_LINK_ANDROID`, chplayUrl)
        .replace(`${keyToEditCorePlayable}_KEY_LINK_IOS`, appstoreUrl);

      downloadFile(templateContent, `playable_${option}.html`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Helper function to download file
  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleChplayUrl = (url, isValid) => {
    setChplayUrl(url);
    setIsValidChplay(isValid);
  };

  const handleAppstoreUrl = (url, isValid) => {
    setAppstoreUrl(url);
    setIsValidAppstore(isValid);
  };
  const isValidExport = () => {
    return !verticalVideo 
        || !horizontalVideo 
        || (!isValidChplay && chplayUrl.length >0)
        || !(isValidAppstore && appstoreUrl.length >0)
        ||sizeError.length >0
  }
  return (
    <div className="video-icon-tool">
      <h1>Video Playable Tool</h1>
      {sizeError && <div className="size-error">{sizeError}</div>}

     <div className="wrap-input-video-up-load">
        
      <VideoInput
        label="Vertical Video"
        id="vertical-video"
        onChange={handleVerticalVideoChange}
        selectedFile={verticalVideo}
      />

      <VideoInput
        label="Horizontal Video"
        id="horizontal-video"
        onChange={handleHorizontalVideoChange}
        selectedFile={horizontalVideo}
      />
     </div>
      <StoreUrlInput
        label="Google Play Store URL"
        id="chplay-url"
        onChange={handleChplayUrl}
        placeholder="https://play.google.com/store/apps/details?id=com.example.app"
      />

      <StoreUrlInput
        label="App Store URL"
        id="appstore-url"
        onChange={handleAppstoreUrl}
        placeholder="https://apps.apple.com/us/app/example-app/id123456789"
      />
      <div className="wrap-buttons-option-export">
        <button 
          className="export-button unity-button"
          onClick={() => handleExport(ExportOption.UNITY)}
          disabled={isValidExport()
          }
        >
          <i className="unity-icon"></i>
          Unity
        </button>
        <button 
          className="export-button mintegral-button"
          onClick={() => handleExport (ExportOption.MINTEGRAL)}
          disabled={isValidExport()}
        >
          <i className="mintegral-icon"></i>
          Mintegral
        </button>
        <button 
          className="export-button google-ad-button"
          onClick={() => handleExport (ExportOption.GOOGLE_AD)}
          disabled={isValidExport()}
        >
          <i className="google-ad-icon"></i>
          Google Ad
        </button>
        <button 
          className="export-button applovin-button"
          onClick={() => handleExport (ExportOption.APPLOVIN)}
          disabled={isValidExport()}
        >
          <i className="applovin-icon"></i>
          AppLovin
        </button>
      </div>
      
    </div>
  );
};

export default VideoIconTool;