import React, { useState, useEffect } from 'react';
import './TextToSpeech.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('English (US) - Female');
  const [speed, setSpeed] = useState(50);
  const [volume, setVolume] = useState(80);
  const [pitch, setPitch] = useState(60);
  const [outputDevice, setOutputDevice] = useState('Default Speakers');

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const handleSpeak = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      setError('Please enter some text');
      return;
    }

    if (trimmedText.length > 5000) {
      setError('Text is too long. Maximum 5000 characters allowed.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAudioUrl('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://b38a617yef.execute-api.us-east-1.amazonaws.com/dev/tts';
      
      console.log("Using API URL:", apiUrl);
      console.log("Sending text:", trimmedText);
      console.log("Browser info:", {
        userAgent: navigator.userAgent,
        online: navigator.onLine,
        protocol: window.location.protocol,
        host: window.location.host
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ text: trimmedText }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Check for s3_url in the response
      let audioUrlFromResponse = data.s3_url;
      if (!audioUrlFromResponse) {
        // Fallback: check if the response body contains audioUrl
        const body = typeof data === 'string' ? JSON.parse(data) : data;
        audioUrlFromResponse = body.audioUrl || body.s3_url;
        console.log("Found audioUrl from body:", audioUrlFromResponse);
      } else {
        console.log("Found s3_url:", audioUrlFromResponse);
      }

      if (audioUrlFromResponse) {
        console.log("Setting audio URL:", audioUrlFromResponse);
        setAudioUrl(audioUrlFromResponse);
      } else {
        throw new Error('No audio URL found in response');
      }
    } catch (err) {
      console.log("API failed, falling back to browser speech synthesis:", err.message);
      
      // Fallback to browser speech synthesis
      try {
        const utterance = new SpeechSynthesisUtterance(trimmedText);
        
        // Set voice properties based on UI controls
        utterance.rate = speed / 50; // Convert 0-100 to 0.5-2.0
        utterance.pitch = pitch / 50; // Convert 0-100 to 0.5-2.0
        utterance.volume = volume / 100; // Convert 0-100 to 0-1
        
        // Set voice if selected
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          const selectedVoiceIndex = voices.findIndex(voice => 
            voice.name.includes(selectedVoice.split(' - ')[0])
          );
          if (selectedVoiceIndex >= 0) {
            utterance.voice = voices[selectedVoiceIndex];
          }
        }
        
        utterance.onstart = () => {
          console.log("Speech started");
        };
        
        utterance.onend = () => {
          console.log("Speech completed");
          setIsLoading(false);
        };
        
        utterance.onerror = (event) => {
          console.error("Speech error:", event.error);
          setError(`Speech synthesis error: ${event.error}`);
          setIsLoading(false);
        };
        
        speechSynthesis.speak(utterance);
        // Don't show error message for fallback - it's working fine
        
      } catch (speechErr) {
        console.error("Speech synthesis failed:", speechErr);
        setError(`Both API and speech synthesis failed: ${speechErr.message}`);
        setIsLoading(false);
      }
    }
  };

  const handlePause = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.pause();
    }
    // Also stop speech synthesis
    speechSynthesis.cancel();
  };

  const handleStop = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    // Also stop speech synthesis
    speechSynthesis.cancel();
  };

  return (
    <div className="container">
      <header>
        <div className="logo">
          <i className="fas fa-wave-square"></i>
          <h1>VoiceSynth Pro</h1>
        </div>
        <div className="controls">
          <button className="btn"><i className="fas fa-history"></i> History</button>
          <button className="btn"><i className="fas fa-cog"></i> Settings</button>
        </div>
      </header>
      
      <div className="main-content">
        <div className="text-input">
          <div className="input-header">
            <h2>Enter Text to Convert</h2>
            <div className="char-count" style={{ color: charCount > 5000 ? '#ff6b6b' : '#a0a0c0' }}>
              Characters: {charCount}/5000
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            rows="10"
          />
          
          <div className="visualizer">
            <div className="bar" style={{'--i': 1}}></div>
            <div className="bar" style={{'--i': 2}}></div>
            <div className="bar" style={{'--i': 3}}></div>
            <div className="bar" style={{'--i': 4}}></div>
            <div className="bar" style={{'--i': 5}}></div>
            <div className="bar" style={{'--i': 6}}></div>
            <div className="bar" style={{'--i': 7}}></div>
            <div className="bar" style={{'--i': 8}}></div>
            <div className="bar" style={{'--i': 9}}></div>
            <div className="bar" style={{'--i': 10}}></div>
          </div>
        </div>
        
        <div className="settings">
          <div className="setting-group">
            <h3>VOICE SETTINGS</h3>
            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
              <option>English (US) - Female</option>
              <option>English (US) - Male</option>
              <option>English (UK) - Female</option>
              <option>English (UK) - Male</option>
              <option>Spanish - Female</option>
              <option>French - Female</option>
              <option>German - Female</option>
            </select>
          </div>
          
          <div className="setting-group">
            <h3>SPEECH PARAMETERS</h3>
            <div className="slider-container">
              <i className="fas fa-tachometer-alt"></i>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
              />
              <span>Speed</span>
            </div>
            
            <div className="slider-container">
              <i className="fas fa-volume-up"></i>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
              <span>Volume</span>
            </div>
            
            <div className="slider-container">
              <i className="fas fa-sliders-h"></i>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
              />
              <span>Pitch</span>
            </div>
          </div>
          
          <div className="setting-group">
            <h3>AUDIO OUTPUT</h3>
            <select value={outputDevice} onChange={(e) => setOutputDevice(e.target.value)}>
              <option>Default Speakers</option>
              <option>Headphones</option>
              <option>Bluetooth Device</option>
              <option>Save as MP3</option>
            </select>
          </div>
          
          <div className="action-buttons">
            <button className="action-btn" onClick={handlePause}>
              <i className="fas fa-pause"></i>
              <span>Pause</span>
            </button>
            <button className="action-btn" onClick={handleStop}>
              <i className="fas fa-stop"></i>
              <span>Stop</span>
            </button>
            <button className="action-btn play-btn" onClick={handleSpeak} disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-play"></i>
                  <span>Convert to Speech</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {audioUrl && (
        <audio className="audio-player" controls style={{ width: '100%', marginTop: '20px' }}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <footer>
        <p>VoiceSynth Pro v2.1 | Professional Text-to-Speech Engine | © 2023 All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default TextToSpeech;