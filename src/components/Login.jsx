import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Eye, EyeOff, Heart, Music, Brain, Check, CloudMoon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./LoginForm.css";
import axiosInstance from './axiosInstance';
const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const features = [
    { 
      icon: Heart, 
      title: "Emotion Journal", 
      description: "Track your emotional journey with our intuitive daily mood logger",
      color: "#FF6B8B"
    },
    { 
      icon: Brain, 
      title: "AI Insights", 
      description: "Receive personalized recommendations based on your emotional patterns",
      color: "#7C3AED"
    },
    { 
      icon: Music, 
      title: "Music Therapy", 
      description: "Discover mood-enhancing playlists tailored to your emotional state",
      color: "#3B82F6"
    }
  ];

  

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axiosInstance.get("/api/get-csrf-token/");
        // The token will be automatically set in cookies and handled by axios
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };
    getCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axiosInstance.post(
        "/api/login/",
        {
          email: formData.email,
          password: formData.password,
        }
      );  // No need to manually set CSRF header as axios will handle it
      
      if (response.status === 200) {
        setSuccess("Login successful!");
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        setTimeout(() => {
          navigate("/emotions");
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.detail || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  return (
    <div className="ant-login-container">
      <motion.div 
        className="ant-login-brand"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CloudMoon className="ant-login-brand-icon" />
        <h1>MindfulMood</h1>
      </motion.div>

      <div className="ant-login-floating-shapes">
        <motion.div 
          className="shape shape-1"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        ></motion.div>
        <motion.div 
          className="shape shape-2"
          animate={{ 
            rotate: -360,
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        ></motion.div>
        <motion.div 
          className="shape shape-3"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
            x: [0, 40, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        ></motion.div>
      </div>

      <motion.div 
        className="ant-login-content"
        initial="hidden"
        animate="visible"
      >
        {/* Features Section - Now on the left */}
        <motion.div 
          className="ant-login-features-wrapper"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="ant-login-features-title">
            Transform Your Mental Wellness Journey
          </h2>
          
          <div className="ant-login-features">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="ant-login-feature-card"
                whileHover={{ scale: 1.02, translateX: 10 }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                style={{ borderColor: feature.color }}
              >
                <feature.icon className="ant-login-feature-icon" style={{ color: feature.color }} />
                <h3 style={{ color: feature.color }}>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          className="ant-login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="ant-login-icon-container">
            <LogIn className="ant-login-welcome-icon" />
            <LogIn className="ant-login-icon" />
          </div>
          
          <h2 className="ant-login-title">Welcome Back</h2>
          <p className="ant-login-subtitle">Continue your wellness journey</p>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="ant-login-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p>{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                className="ant-login-success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p>{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="ant-login-form">
            <motion.div
              className="ant-login-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="ant-login-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="ant-login-input"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div
              className="ant-login-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="ant-login-label">Password</label>
              <div className="ant-login-password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="ant-login-input"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="ant-login-password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <div className="ant-login-remember-container">
              <div className="ant-login-checkbox-group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="ant-login-checkbox"
                />
                <label htmlFor="rememberMe" className="ant-login-checkbox-label">
                  Remember me
                </label>
              </div>
              <a href="/forgot-password" className="ant-login-forgot-link">
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              className="ant-login-button"
              disabled={isLoading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="ant-login-loading">
                  <span className="ant-login-spinner"></span>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </motion.button>
          </form>

          <motion.p
            className="ant-login-signup-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Don't have an account?{' '}
            <a href="/signup" className="ant-login-link">
              Sign up
            </a>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
