import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewQuestions.css';

const ViewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswer = (questionID) => {
    navigate(`/answer-question/${questionID}`);
  };

  return (
    <div className="container">
      <h2>All Questions</h2>
      {questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        <ul className="list-group">
          {questions.map(question => (
            <li key={question.QuestionID} className="list-group-item">
              {question.Question}
              <button className="btn btn-primary" onClick={() => handleAnswer(question.QuestionID)}>
                Answer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewQuestions;
