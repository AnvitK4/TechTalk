import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Import the CSS file

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    dob: '',
    jobTitle: '',
    summary: '',
    hobbies: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

  useEffect(() => {
    // Fetch existing profile data from the server
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${userId}`);
        setProfileData(response.data);
      } catch (error) {
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/profile', profileData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={profileData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Job Title:</label>
          <input
            type="text"
            name="jobTitle"
            value={profileData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Summary:</label>
          <textarea
            name="summary"
            value={profileData.summary}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Hobbies:</label>
          <input
            type="text"
            name="hobbies"
            value={profileData.hobbies}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
};

export default Profile;
