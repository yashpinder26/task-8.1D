import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PostPage from './PostPage';
import FindQuestionPage from './FindQuestionPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
            <li style={{ margin: '0 10px' }}>
              <Link to="/">Find Questions</Link>
            </li>
            <li style={{ margin: '0 10px' }}>
              <Link to="/post">Create Post</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<FindQuestionPage />} />
          <Route path="/post" element={<PostPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
