import React from "react";
import EmotionAnalyzer from "./components/EmotionAnalyzer";
import Music from "./components/Music";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage"
import SignUpForm from "./components/Signup";
import Login from "./components/Login";
import Logout from "./components/Logout";
import EmotionDashboard from "./components/EmotionDashboard";
import RecentEmotions from "./components/RecentEmotions";
const App = () => {
    return (
        <Router>
        <Routes>
         <Route path="/" element={<LandingPage />} />
         <Route path="/signup" element={<SignUpForm />} />
         <Route path="/Login" element={<Login />} />
         <Route path="/Logout" element={<Logout />} />
          <Route path="/emotions" element={<EmotionAnalyzer />} />
          <Route path="/music" element={<Music />} />
          <Route path="/emotion-dashboard" element={<EmotionDashboard />} />
          <Route path="/recent" element={<RecentEmotions />} />

        </Routes>

      </Router>
    );
};

export default App;
