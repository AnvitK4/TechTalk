import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./RegistrationForm.css";

const RegistrationForm = () => {
    const navigate = useNavigate(); // Use useNavigate hook

    const redirectToLogin = () => {
        navigate('/login'); // Navigate to '/login' route
    };

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobileno, setMobileno] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/register', {
                Fullname: fullname,
                Email: email,
                Password: password,
                Mobileno: mobileno,
                Role: role
            });
            console.log('Registration Successful', response.data);
            redirectToLogin();
            // Redirect to login page or handle success message
        } catch (error) {
            console.error('Registration error:', error);
            // Handle error, show error message
        }
    };

    return (
        <div className="register-page">
            <div className="form-container">
                <h1 className="form-title">Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Fullname"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                        className="form-input"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                    <input
                        type="text"
                        placeholder="Mobile Number"
                        value={mobileno}
                        onChange={(e) => setMobileno(e.target.value)}
                        className="form-input"
                    />
                    <input
                        type="text"
                        placeholder="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="form-input"
                    />
                    <button
                        type="submit"
                        className="form-button register-button"
                    >
                        Register
                    </button>
                    <button
                        type="button"
                        className="form-button login-button"
                        onClick={redirectToLogin}
                    >
                        Go to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
