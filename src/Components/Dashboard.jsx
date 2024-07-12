import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance'; // Import the configured Axios instance
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/auth/user');
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error fetching user data.');
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!userData) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Welcome, {userData.Fullname}</h2>
            </div>
            <div className="dashboard-content">
                <div className="dashboard-item">
                    <p><strong>Email:</strong> {userData.Email}</p>
                </div>
                <div className="dashboard-item">
                    <p><strong>Mobile No:</strong> {userData.Mobileno}</p>
                </div>
                <div className="dashboard-item">
                    <p><strong>Role:</strong> {userData.Role}</p>
                </div>
                <div className="dashboard-item">
                    <p><strong>Join Date:</strong> {new Date(userData.JoinDate).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="dashboard-buttons">
                <button onClick={() => handleNavigation('/profile')}>Profile</button>
                <button onClick={() => handleNavigation('/post-question')}>Post a Question</button>
                <button onClick={() => handleNavigation('/view-questions')}>View Questions</button>
            </div>
        </div>
    );
};

export default Dashboard;
