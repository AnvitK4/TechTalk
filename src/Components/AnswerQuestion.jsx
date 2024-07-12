import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './AnswerQuestion.css';

const AnswerQuestion = () => {
  const { questionID } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/questions/${questionID}`);
      setQuestion(response.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/questions/${questionID}/answers`);
      setAnswers(response.data);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const handleAnswerSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://127.0.0.1:5000/answer-question',
        {
          QuestionID: questionID,
          Answer: newAnswer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNewAnswer('');
      fetchAnswers();
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  return (
    <div className="container">
      {question ? (
        <>
          <h2>{question.Question}</h2>
          <div className="mt-4">
            <h4>Previous Answers:</h4>
            {answers.length === 0 ? (
              <p>No answers yet.</p>
            ) : (
              <ul className="list-group">
                {answers.map(answer => (
                  <li key={answer.AnswerID} className="list-group-item">
                    <div>{answer.Answer}</div>
                    <Link to={`/answers/${answer.AnswerID}/comments`} className="btn btn-secondary btn-sm mt-2">
                      Add Comment
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4">
            <h4>Your Answer:</h4>
            <textarea
              className="form-control"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows="4"
            ></textarea>
            <button className="btn btn-primary mt-2" onClick={handleAnswerSubmit}>
              Submit Answer
            </button>
          </div>
        </>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default AnswerQuestion;
