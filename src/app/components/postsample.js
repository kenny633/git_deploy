"use client"
// pages/forum.js

import React, { useState } from 'react';
import Image from 'next/image';

const ForumPage = () => {
  const [images, setImages] = useState([
    '/image1.jpg',
    '/image2.jpg',
    // 添加更多图片路径
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim() !== '') {
      setComments([...comments, comment.trim()]);
      setComment('');
    }
  };

  return (
    <div>
      <div className="gallery">
        <button className="prev-btn" onClick={handlePrevious}>
          &lt;
        </button>
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          width={800}
          height={450}
          layout="responsive"
        />
        <button className="next-btn" onClick={handleNext}>
          &gt;
        </button>
      </div>
      <div className="post-content">
        <h2>京都</h2>
        <p>
          京都位於日本本州中部附近,隸屬關西地區。自西元794年桓武天皇將首都從長岡遷到京都,
          直到發起明治維新,京都一直作為日本政治、經濟和文化的中心地而繁榮興盛。
        </p>
      </div>
      <div className="comment-section">
        <h3>留言</h3>
        <input
          type="text"
          className="comment-input"
          placeholder="在此輸入您的評論..."
          value={comment}
          onChange={handleCommentChange}
        />
        <button className="comment-button" onClick={handleCommentSubmit}>
          發表
        </button>
        {comments.map((c, index) => (
          <div key={index} className="comment">
            {c}
          </div>
        ))}
      </div>
      <style jsx>{`
        .gallery {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
        .prev-btn,
        .next-btn {
          font-size: 24px;
          padding: 10px;
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
        .post-content {
          padding: 20px;
        }
        .comment-section {
          margin-top: 20px;
          padding: 20px;
        }
        .comment-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .comment-button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .comment {
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default ForumPage;