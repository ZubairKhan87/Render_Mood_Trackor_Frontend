import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Heart, Music, Brain, Check, CloudMoon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./LoginForm.css";


const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const features = [
    { 
      icon: Heart, 
      title: "Emotion Journal", 
      description: "Record and analyze your daily emotions with our intuitive mood tracker",
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
      description: "Access mood-enhancing playlists tailored to your emotional state",
      color: "#3B82F6"
    }
  ];

  

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Account created successfully!");
        setTimeout(() => {
          navigate('/emotions');
        }, 1500);
      } else {
        setError(data.detail || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        {/* Features Section */}
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

        {/* Signup Form */}
        <motion.div 
          className="ant-login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="ant-login-icon-container">
            <UserPlus className="ant-login-welcome-icon" />
            <UserPlus className="ant-login-icon" />
          </div>
          
          <h2 className="ant-login-title">Create Account</h2>
          <p className="ant-login-subtitle">Begin your wellness journey</p>

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
              <label className="ant-login-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="ant-login-input"
                placeholder="Enter your name"
                required
              />
            </motion.div>

            <motion.div
              className="ant-login-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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
              transition={{ delay: 0.4 }}
            >
              <label className="ant-login-label">Password</label>
              <div className="ant-login-password-container">
                <input
                  type={showPassword.password ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="ant-login-input"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  className="ant-login-password-toggle"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword.password ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              className="ant-login-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="ant-login-label">Confirm Password</label>
              <div className="ant-login-password-container">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="ant-login-input"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className="ant-login-password-toggle"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showPassword.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <motion.p
            className="ant-login-signup-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Already have an account?{' '}
            <a href="/login" className="ant-login-link">
              Log in
            </a>
          </motion.p>
        </motion.div>

        {/* Benefits Section
        <motion.div 
          className="ant-login-benefits-wrapper"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="ant-login-benefits-title">Why Choose MindfulMood?</h2>
          <div className="ant-login-benefits-list">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="ant-login-benefit-card"
                whileHover={{ scale: 1.02, translateX: -10 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="ant-login-benefit-icon">
                  <Check size={20} />
                </div>
                <div className="ant-login-benefit-content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </motion.div>
    </div>
  );
};

export default SignUpForm;