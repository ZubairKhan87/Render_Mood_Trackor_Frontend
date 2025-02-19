import React from 'react';
import { motion } from 'framer-motion';
import { Music, UserPlus, LogIn, ArrowRight, Heart,CloudMoon} from 'lucide-react';
import './LandingPage.css';  // We'll create this CSS file next
import { useNavigate } from 'react-router-dom';
// Shared Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};



const LandingPage = () => {
  const navigate = useNavigate();
  const HandleLogin=()=>{
    navigate('/login');
  }

  const HandleSignup=()=>{
    navigate('/signup');
  }
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo-container">
          <Music className="logo-icon" />
         
          {/* <span className="logo-text">MindfulMood</span> */}
          <CloudMoon className="ant-login-brand-icon" />
          <h1 className='heading1'>MindfulMood</h1>
        </div>
        <div className="nav-buttons">
          <button onClick={HandleLogin} className="btn btn-secondary">Login</button>
          <button onClick={HandleSignup} className="btn btn-primary">Sign Up</button>
        </div>
      </nav>

      <main className="main-content">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="hero-section"
        >
          <h1 className="hero-title">
            Let Your Mood Guide Your Music
          </h1>
          <p className="hero-description">
            Discover personalized music recommendations based on your emotions. 
            Let AI analyze your mood and create the perfect playlist for every moment.
          </p>
          <button className="btn btn-primary btn-large">
            Get Started Free
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="features-grid"
        >
          {[
            {
              icon: <Heart className="feature-icon" />,
              title: "Emotion Analysis",
              description: "Advanced AI analyzes your mood through text and emojis"
            },
            {
              icon: <Music className="feature-icon" />,
              title: "Personalized Playlists",
              description: "Get music recommendations that match your emotional state"
            },
            {
              icon: <ArrowRight className="feature-icon" />,
              title: "Track Progress",
              description: "Visualize your mood patterns over time"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.2 }}
              className="feature-card"
            >
              <div className="feature-icon-container">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;