// logoutHandler.js
import axiosInstance from './axiosInstance';

 const handleLogout = async () => {
  try {
    const response = await axiosInstance.post('/api/logout/', {}, { withCredentials: true });

    if (response.status === 200) {
      window.location.href = '/'; // Redirect to login page
    } else {
      console.error('Logout failed:', response.data.detail || 'Unknown error');
    }
  } catch (error) {
    console.error('An error occurred while logging out:', error.response?.data?.detail || error.message);
  }
};
export default handleLogout;