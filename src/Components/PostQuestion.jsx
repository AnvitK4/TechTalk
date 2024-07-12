import React, { useState } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import "./PostQuestion.css";

const PostQuestion = () => {
    const [questionData, setQuestionData] = useState({
        Question: '',
        Que_prefix: '',
        Prog_topic: '',
        Prog_tech: '',
        Prog_lang: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setQuestionData({
            ...questionData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/post-question', questionData);
            setSuccess('Question posted successfully!');
            setError('');
        } catch (error) {
            console.error('Error posting question:', error);
            setError('Error posting question.');
            setSuccess('');
        }
    };

    return (
        <div className="post-question-container">
            <div className="post-question">
                <h2>Post a Question</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="Question"
                        value={questionData.Question}
                        onChange={handleChange}
                        placeholder="Question"
                        required
                    />
                    <input
                        type="text"
                        name="Que_prefix"
                        value={questionData.Que_prefix}
                        onChange={handleChange}
                        placeholder="Question Prefix"
                        required
                    />
                    <input
                        type="text"
                        name="Prog_topic"
                        value={questionData.Prog_topic}
                        onChange={handleChange}
                        placeholder="Programming Topic"
                        required
                    />
                    <input
                        type="text"
                        name="Prog_tech"
                        value={questionData.Prog_tech}
                        onChange={handleChange}
                        placeholder="Programming Technology"
                        required
                    />
                    <input
                        type="text"
                        name="Prog_lang"
                        value={questionData.Prog_lang}
                        onChange={handleChange}
                        placeholder="Programming Language"
                        required
                    />
                    <button type="submit">Post Question</button>
                </form>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </div>
        </div>
    );
};

export default PostQuestion;
