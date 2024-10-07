import React, { useEffect, useState, useMemo } from 'react';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { debounce } from 'lodash';
import './FindQuestionPage.css';

const FindQuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchQuestions = async () => {
    try {
      const questionsCollection = collection(db, 'articles');
      const questionsQuery = query(questionsCollection, orderBy('date', 'desc'), limit(10));
      const questionSnapshot = await getDocs(questionsQuery);
      const questionList = questionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(questionList);
      setLastDoc(questionSnapshot.docs[questionSnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreQuestions = async () => {
    try {
      if (!lastDoc) return;
      const questionsCollection = collection(db, 'articles');
      const questionsQuery = query(questionsCollection, orderBy('date', 'desc'), startAfter(lastDoc), limit(10));
      const questionSnapshot = await getDocs(questionsQuery);
      const questionList = questionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setQuestions((prevQuestions) => [...prevQuestions, ...questionList]);
      setLastDoc(questionSnapshot.docs[questionSnapshot.docs.length - 1]);
    } catch (error) {
      console.error('Error loading more questions:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'articles', id));
      setQuestions(questions.filter(question => question.id !== id));
      alert('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleFilterChange = debounce((value) => {
    setFilter(value);
  }, 300);

  const filteredQuestions = useMemo(() => {
    return questions.filter(question => question.title.toLowerCase().includes(filter.toLowerCase()));
  }, [questions, filter]);

  return (
    <div className="find-question-container">
      <h2>Find Questions</h2>
      <input
        type="text"
        placeholder="Filter by title"
        onChange={(e) => handleFilterChange(e.target.value)}
      />

      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <div className="questions-list">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="question-card">
              <h3>{question.title}</h3>
              <p>{question.description}</p>
              <p><small>{new Date(question.date.seconds * 1000).toLocaleDateString()}</small></p>
              <button onClick={() => handleDelete(question.id)}>Delete</button>
            </div>
          ))}
          <button onClick={loadMoreQuestions} disabled={!lastDoc}>Load More</button>
        </div>
      )}
    </div>
  );
};

export default FindQuestionPage;
