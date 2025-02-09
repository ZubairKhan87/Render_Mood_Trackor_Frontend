import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Music.css';

const Music = () => {
  const [songs, setSongs] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showStats, setShowStats] = useState(true);
  const audioRef = useRef(null);
  const location = useLocation();

  const emotion = location.state?.emotion || '';

  // Mock stats - you can replace with real data
  const stats = {
    totalSongs: songs.length,
    matchScore: '95%',
    moodCategory: emotion
  };

  useEffect(() => {
    audioRef.current = new Audio();
    if (emotion) {
      fetchSongs();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [emotion]);

  const fetchSongs = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/fetch-songs/', {
        emotion: emotion.toLowerCase(),
      });

      if (response.data.songs && response.data.songs.length > 0) {
        setSongs(response.data.songs);
      } else {
        setError('No songs found for this emotion.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch songs');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = (song) => {
    if (!audioRef.current) return;

    if (currentlyPlaying === song.preview_url) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioRef.current.src !== song.preview_url) {
        audioRef.current.src = song.preview_url;
      }
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setError('Unable to play preview');
      });
      setCurrentlyPlaying(song.preview_url);
    }
  };

  const openSpotify = (url) => {
    window.open(url, '_blank');
  };

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
      </div>
      <p className="loading-text">Curating your perfect playlist...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <div className="error-message">{error}</div>
      <button className="retry-button" onClick={fetchSongs}>Try Again</button>
    </div>
  );

  return (
    <div className="music-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="music-note">♪</div>
        <div className="music-note">♫</div>
        <div className="music-note">♬</div>
      </div>

      <div className="music-container">
        {/* Header Section */}
        <div className="header-section">
          <motion.h2 
            className="music-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Feel It, Heal It Your {emotion} Mood Playlist
          </motion.h2>
          <p className="subtitle">Curated songs to match your emotional state</p>
        </div>

        {/* Stats Panel */}
        <motion.div 
          className="stats-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="stat-item">
            <span className="stat-value">{stats.totalSongs}</span>
            <span className="stat-label">Songs Found</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.matchScore}</span>
            <span className="stat-label">Mood Match</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.moodCategory}</span>
            <span className="stat-label">Mood Category</span>
          </div>
        </motion.div>

        {/* Songs Grid */}
        <motion.div 
          className="songs-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {songs.map((song, index) => (
            <motion.div 
              key={index} 
              className="song-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="song-image-container">
                {song.album_image && (
                  <img 
                    src={song.album_image} 
                    alt={song.name} 
                    className="song-image"
                  />
                )}
                {currentlyPlaying === song.preview_url && (
                  <div className="playing-indicator">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                )}
              </div>
              <div className="song-info">
                <h3 className="song-title">{song.name}</h3>
                <p className="song-artist">{song.artist}</p>
                <div className="button-group">
                  {song.preview_url && (
                    <button
                      onClick={() => handlePlayPause(song)}
                      className={`play-button ${currentlyPlaying === song.preview_url ? 'playing' : ''}`}
                    >
                      {currentlyPlaying === song.preview_url ? 'Pause' : 'Preview'}
                    </button>
                  )}
                  <button
                    onClick={() => openSpotify(song.url)}
                    className="spotify-button"
                  >
                    Open in Spotify
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Music;