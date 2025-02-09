import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import './LogoutForm.css';  // Make sure to create this CSS file for styling

const LogoutForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call the backend logout endpoint
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',  // Include cookies in the request
      });

      if (response.ok) {
        // Successfully logged out, redirect or update UI accordingly
        setIsLoading(false);
        window.location.href = '/login';  // Redirect to login page or homepage
      } else {
        const data = await response.json();
        setError(data.detail || 'Logout failed');
        setIsLoading(false);
      }
    } catch (error) {
      setError('An error occurred while logging out');
      setIsLoading(false);
    }
  };

  return (
    <div className="ant-logout-container">
      <div className="ant-logout-card">
        <div className="ant-logout-icon-container">
          <LogOut className="ant-logout-icon" />
        </div>

        <h2 className="ant-logout-title">Are you sure you want to log out?</h2>

        {error && <p className="ant-logout-error">{error}</p>}

        <button
          onClick={handleLogout}
          className={`ant-logout-button ${isLoading ? 'ant-logout-button--loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Logging Out...' : 'Log Out'}
        </button>
      </div>
    </div>
  );
};

export default LogoutForm;
