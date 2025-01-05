
// packages/blog-client/src/components/CommentSection.jsx
import React, { useState, useEffect } from 'react';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`);
        const data = await response.json();
        setComments(data.data);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    }

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          username
        })
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([...comments, newCommentData.data]);
        setNewComment('');
        setUsername('');
      }
    } catch (error) {
      console.error('Failed to submit comment', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.map(comment => (
        <div key={comment.id} className="mb-4 p-4 border rounded">
          <p>{comment.content}</p>
          <small className="text-gray-500">
            By {comment.username} on {new Date(comment.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}

      <form onSubmit={handleSubmitComment} className="mt-6">
        <input 
          type="text" 
          placeholder="Your Name" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required 
        />
        <textarea 
          placeholder="Write a comment..." 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows="4"
          required
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
}

export default CommentSection;