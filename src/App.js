import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginForm';
import RegisterPage from './Components/RegistrationForm';
import QuestionsPage from './Components/QuestionsPage';
import ViewQuestions from './Components/ViewQuestions';
import PostQuestion from './Components/PostQuestion';
import AnswerQuestion from './Components/AnswerQuestion';
import Dashboard from './Components/Dashboard';
// import QuestionsList from './Components/QuestionsList';
import Profile from './Components/Profilepage';
import CommentPage from './Components/CommentPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<RegisterPage />} /> {/* Adjust to your default landing page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/questions" element={<QuestionsPage />} /> 
        <Route path="/view-questions" element={<ViewQuestions />} />
        <Route path="/post-question" element={<PostQuestion />} />
        <Route path="/answer-question/:questionID" element={<AnswerQuestion />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/answers/:answerId/comments" element={<CommentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
