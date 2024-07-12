import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CommentPage.css'; // Import the CSS file

const CommentPage = () => {
  const { answerID } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (answerID) {
      fetchComments(); // Call fetchComments only if answerID is defined
    }
  }, [answerID]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/answers/${answerID}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:5000/answers/${answerID}/comments`,
        { text: newComment }, // Pass the new comment text
        {
          withCredentials: true, // Send cookies if applicable
          crossDomain: true, // Force cross-domain request
        }
      );
      console.log('Comment submitted successfully');
      setNewComment(''); // Clear textarea after successful submission
      fetchComments(); // Fetch updated comments after submission
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Handle error, show an error message
    }
  };

  return (
    <div className="container">
      <h2>Comments for Answer {answerID}</h2>
      <ul className="list-group">
        {comments.map(comment => (
          <li key={comment.id} className="list-group-item">
            {comment.text}
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h4>Add Comment:</h4>
        <textarea
          className="form-control"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="4"
        ></textarea>
        <button className="btn btn-primary mt-2" onClick={handleCommentSubmit}>
          Submit Comment
        </button>
      </div>
    </div>
  );
};

export default CommentPage;
