import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecentEmotions.css';

const RecentEmotions = () => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentEmotions = async () => {
      setLoading(true);
      try {
        const csrfToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('csrftoken='))
          ?.split('=')[1];

        const response = await axios.get('/api/recent-emotions/', {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });

        console.log('Raw API Response:', response.data);
        setEmotions(response.data.emotions || []);
      } catch (err) {
        console.error('Error fetching emotions:', err);
        setError(err.message || 'Failed to fetch emotions');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEmotions();
  }, []);

  if (loading) {
    return <div className="emotions-loading">Loading recent emotions...</div>;
  }

  if (error) {
    return <div className="emotions-error">Error: {error}</div>;
  }

  return (
    <div className="recent-emotions-debug">
      <h2>Recently Saved Emotions</h2>
      <div className="debug-info">
        <p>Total emotions loaded: {emotions.length}</p>
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>
      
      <div className="emotions-list">
        {emotions.length > 0 ? (
          emotions.map((emotion, index) => (
            <div key={index} className="emotion-item">
              <div className="emotion-header">
                <span className="emotion-timestamp">
                  {new Date(emotion.created_at).toLocaleString()}
                </span>
                <span className="emotion-id">ID: {emotion.id}</span>
              </div>
              <div className="emotion-content">
                <p><strong>Mood:</strong> {emotion.mood}</p>
                <p><strong>Text:</strong> {emotion.text}</p>
                <p><strong>Emojis:</strong> {emotion.emojis || 'No emoji'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-emotions">
            No emotions found in the database
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentEmotions;