import React, { useState } from 'react';
import { db, storage } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './PostPage.css'; 

const PostPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [postType, setPostType] = useState('article');

  const handlePost = async () => {
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `articles/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'articles'), {
        title,
        description,
        imageUrl,
        date: new Date(),
        postType,
      });

      setTitle('');
      setDescription('');
      setImage(null);
      alert('Post uploaded successfully!');
    } catch (error) {
      console.error('Error uploading post:', error);
    }
  };

  return (
    <div className="post-container">
      <h2 className="post-title">New Post</h2>

      <div className="post-input-group">
        <label>Select Post Type:</label>
        <div>
          <label>
            <input
              type="radio"
              value="question"
              checked={postType === 'question'}
              onChange={() => setPostType('question')}
            />
            Question
          </label>
          <label>
            <input
              type="radio"
              value="article"
              checked={postType === 'article'}
              onChange={() => setPostType('article')}
            />
            Article
          </label>
        </div>
      </div>

      <div className="post-input-group">
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter a descriptive title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {postType === 'article' && ( 
        <div className="post-input-group">
          <label>Add an image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button className="upload-button">Upload</button>
        </div>
      )}

      {postType === 'article' && ( 
        <div className="post-input-group">
          <label>Abstract</label>
          <textarea
            placeholder="Enter a 1-paragraph abstract"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      )}

      {postType === 'question' && ( 
        <div className="post-input-group">
          <label>Question Details</label>
          <textarea
            placeholder="Enter your question here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      )}

      <button className="post-button" onClick={handlePost}>Post</button>
    </div>
  );
};

export default PostPage;
