import React, { useState, useEffect } from 'react';

const SpotifyPlayer = ({ trackUri }) => {
  const [player, setPlayer] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Mood Music Player',
        getOAuthToken: cb => {
          fetch('http://127.0.0.1:8000/api/get-spotify-token/')
            .then(response => response.json())
            .then(data => cb(data.token));
        }
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      spotifyPlayer.addListener('player_state_changed', state => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
      });

      spotifyPlayer.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!player || !trackUri) return;

    const play = async () => {
      await player.connect();
      await player.resume();
      await player.togglePlay();
    };

    play();
  }, [trackUri, player]);

  if (!isActive || !currentTrack) {
    return (
      <div className="spotify-player" style={styles.playerContainer}>
        <div style={styles.loadingMessage}>
          Connecting to Spotify...
        </div>
      </div>
    );
  }

  return (
    <div className="spotify-player" style={styles.playerContainer}>
      <div style={styles.playerControls}>
        <button 
          onClick={() => player.togglePlay()}
          style={styles.playButton}
        >
          {isPaused ? 'Play' : 'Pause'}
        </button>
      </div>
      <div style={styles.nowPlaying}>
        <div style={styles.trackName}>{currentTrack.name}</div>
        <div style={styles.artistName}>{currentTrack.artists[0].name}</div>
      </div>
    </div>
  );
};

const styles = {
  playerContainer: {
    padding: '20px',
    backgroundColor: '#282828',
    borderRadius: '8px',
    color: 'white',
    marginTop: '20px',
  },
  playerControls: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  playButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  nowPlaying: {
    textAlign: 'center',
  },
  trackName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  artistName: {
    fontSize: '14px',
    color: '#b3b3b3',
  },
  loadingMessage: {
    textAlign: 'center',
    padding: '20px',
    color: '#b3b3b3',
  }
};

export default SpotifyPlayer;