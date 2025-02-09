import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { 
  Volume2, // Changed from VolumeUp
  Music4 as Music, // Changed from Music 
  Sun, 
  Moon,
  ChevronRight,
  X as XCircle, // Changed from XCircle
  BarChart2,
  ChevronLeft
} from "lucide-react";
import "./EmotionAnalyzer.css";
// Loading Animation Component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Analyzing your emotions...</p>
  </div>
);

// Welcome Modal Component with enhanced animations
const WelcomeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="welcome-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="welcome-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to Mood Melody</h2>
        <div className="welcome-content">
          {[
            { step: 1, text: "Share your feelings using emojis and text", icon: "🎭" },
            { step: 2, text: "Get personalized emotional insights", icon: "🧠" },
            { step: 3, text: "Discover music that matches your mood", icon: "🎵" }
          ].map(({ step, text, icon }) => (
            <motion.div 
              key={step}
              className="welcome-step"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: step * 0.2 }}
            >
              <div className="step-number">{step}</div>
              <span className="mr-2">{icon}</span>
              <p>{text}</p>
            </motion.div>
          ))}
        </div>
        <motion.button 
          className="welcome-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          Get Started <ChevronRight className="inline ml-2" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Tooltip Component
const Tooltip = ({ text, children }) => (
  <div className="tooltip-container">
    {children}
    <motion.span 
      className="tooltip-text"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      {text}
    </motion.span>
  </div>
);

// Main Component
const EmotionAnalyzer = () => {
  const navigate = useNavigate();
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [charCount, setCharCount] = useState(0);
  const location = useLocation();
  const userData = location.state?.user || JSON.parse(localStorage.getItem('userData'));

  const emojiDetails = [
    { emoji: "😊", label: "Happy", color: "#FFD700", mood: "Joyful" },
    { emoji: "😢", label: "Sad", color: "#87CEFA", mood: "Melancholic" },
    { emoji: "😡", label: "Angry", color: "#FF6347", mood: "Frustrated" },
    { emoji: "😱", label: "Scared", color: "#9370DB", mood: "Anxious" },
    { emoji: "😂", label: "Joyful", color: "#32CD32", mood: "Euphoric" },
    { emoji: "😔", label: "Depressed", color: "#708090", mood: "Low" },
    { emoji: "😇", label: "Peaceful", color: "#20B2AA", mood: "Serene" },
    { emoji: "😎", label: "Confident", color: "#FF4500", mood: "Empowered" },
    { emoji: "🥳", label: "Excited", color: "#FF69B4", mood: "Celebratory" },
    { emoji: "😞", label: "Disappointed", color: "#778899", mood: "Subdued" }
  ];

  useEffect(() => {
    setCharCount(textInput.length);
  }, [textInput]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme');
  };

  const toggleEmoji = useCallback((emoji) => {
    setSelectedEmojis(prev => 
      prev.includes(emoji) 
        ? prev.filter(e => e !== emoji)
        : [...prev, emoji]
    );
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!selectedEmojis.length && !textInput.trim()) {
      setError("Please select emojis or enter text");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/analyze/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          emojis: selectedEmojis,
          text: textInput.trim(),
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('userData');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || "Analysis failed");
      }

      setResult(data);
      setShowRecommendationModal(true);
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakRecommendation = () => {
    if (result?.recommendation) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(result.recommendation);
      
      const voices = synth.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.toLowerCase().includes('female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Microsoft Zira'))
      );
      
      if (femaleVoice) utterance.voice = femaleVoice;
      
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      
      synth.speak(utterance);
    }
  };

  const handleSeeSongs = () => {
    navigate('/music', { state: { emotion: result.emotion } });
  };

  const handleDashboard = () => {
    navigate('/emotion-dashboard', { state: { user: userData } });
  };

  return (
    <div className={`main-container ${currentTheme}`}>
      <div className="fixed top-4 right-4 flex gap-4 z-50">
        {/* <motion.button 
          className="theme-toggle"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
        >
          {currentTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </motion.button> */}
        <motion.button 
          className="theme-toggle flex items-center gap-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDashboard}
          title="View Emotion History"
        >
          <BarChart2 size={20} />
          <span className="text-sm">Track History</span>
        </motion.button>
      </div>

      <div className="animated-background">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
        <div className="floating-shapes">
          <div className="shape shape1">🎵</div>
          <div className="shape shape2">🎶</div>
          <div className="shape shape3">🎼</div>
        </div>
      </div>

      <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />

      <div className="content-wrapper">
        <div className="info-panel">
          {[
            {
              icon: "📊",
              title: "Track Your Emotions",
              description: "Log your daily moods and see patterns over time with our advanced emotion tracking.",
              stat: "7+",
              statLabel: "Emotion Categories"
            },
            {
              icon: "🎵",
              title: "Music Therapy",
              description: "Get AI-powered music recommendations that perfectly match your emotional state.",
              stat: "1M+",
              statLabel: "Songs Available"
            },
            {
              icon: "🧠",
              title: "Smart Insights",
              description: "Gain deeper understanding of your emotional patterns with AI analysis.",
              progress: 85,
              progressLabel: "Accuracy"
            }
          ].map((card, index) => (
            <motion.div 
              key={index}
              className="info-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <span className="info-icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="card-stats">
                {card.stat ? (
                  <div className="stat">
                    <span className="stat-number">{card.stat}</span>
                    <span className="stat-label">{card.statLabel}</span>
                  </div>
                ) : (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress" style={{width: `${card.progress}%`}}></div>
                    </div>
                    <span>{card.progress}% {card.progressLabel}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="emotion-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-header">
            <h1 className="emotion-title">How are you feeling today?</h1>
            <p className="subtitle">Select emojis and describe your mood</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="emoji-section">
            <h3 className="section-title">Select your emotions</h3>
            <div className="emoji-selector">
              {emojiDetails.map(({ emoji, label, color, mood }) => (
                <Tooltip key={emoji} text={mood}>
                  <motion.div 
                    className={`emoji-option ${selectedEmojis.includes(emoji) ? 'selected' : ''}`}
                    onClick={() => toggleEmoji(emoji)}
                    style={{
                      backgroundColor: selectedEmojis.includes(emoji) ? color : 'transparent',
                      borderColor: color
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="emoji">{emoji}</span>
                    <span className="emoji-label">{label}</span>
                    {selectedEmojis.includes(emoji) && (
                      <motion.span 
                        className="emoji-mood"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {mood}
                      </motion.span>
                    )}
                  </motion.div>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="text-section">
            <h3 className="section-title">Express yourself</h3>
            <div className="text-input-container">
              <textarea 
                className="feelings-input"
                placeholder="Tell me more about how you're feeling..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={loading}
                maxLength={500}
              />
              <div className="char-counter">
                {charCount}/500 characters
              </div>
            </div>
          </div>

          <motion.button 
            className="analyze-btn" 
            onClick={handleSubmit} 
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? <LoadingSpinner /> : 'Get Insightful Recommendations'}
          </motion.button>

          <div className="progress-indicator">
            {[
              { step: 1, label: "Select Emotions", completed: selectedEmojis.length > 0 },
              { step: 2, label: "Describe Feelings", completed: textInput.length > 0 },
              { step: 3, label: "Get Insights", completed: result !== null }
            ].map(({ step, label, completed }) => (
              <div key={step} className={`step ${completed ? 'completed' : ''}`}>
                <div className="step-number">{step}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showRecommendationModal && result && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="modal-header">
                <h2>Your Emotional Analysis</h2>
                <motion.div 
                  className="emotion-badge"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {result.emotion}
                </motion.div>
              </div>
              
              <div className="modal-body">
                <motion.div 
                  className="insight-card"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3>Personalized Recommendation</h3>
                  <p>{result.recommendation}</p>
                </motion.div>

                <div className="recommendation-actions">
                  <motion.button 
                    onClick={handleSpeakRecommendation} 
                    className="speak-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Volume2 className="inline mr-2" size={20} /> {/* Changed from VolumeUp */}
                    Listen
                  </motion.button>
                  
                  <motion.button 
                    onClick={handleSeeSongs} 
                    className="see-songs-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Music className="inline mr-2" size={20} />
                    Discover Music
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => setShowRecommendationModal(false)} 
                    className="close-modal-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <XCircle className="inline mr-2" size={20} />
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmotionAnalyzer;