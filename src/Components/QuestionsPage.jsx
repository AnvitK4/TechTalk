import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './QuestionsPage.css'; // Import the CSS file

const QuestionsPage = () => {
  const navigate = useNavigate();

  const handleViewQuestions = () => {
    navigate('/view-questions');
  };

  const handlePostQuestion = () => {
    navigate('/post-question');
  };

  return (
    <div className="container mt-4">
      <h2>Questions Page</h2>
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-primary" onClick={handleViewQuestions}>
          View All Questions
        </button>
        <button className="btn btn-secondary" onClick={handlePostQuestion}>
          Post a Question
        </button>
      </div>
    </div>
  );
};

export default QuestionsPage;
