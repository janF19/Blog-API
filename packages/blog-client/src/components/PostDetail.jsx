

// packages/blog-client/src/components/PostDetail.jsx
// PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import postService from '../services/postService';
import commentService from '../services/commentService';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postData = await postService.getPostById(postId);
        setPost(postData);
        
        // Fetch comments separately
        const commentsData = await commentService.getCommentsByPostId(postId);
        setComments(commentsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const newComment = await commentService.createComment({
        content: newCommentContent,
        postId: parseInt(postId)
      });
      
      // Update comments state
      setComments([...comments, newComment]);
      setNewCommentContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      
      // Remove the deleted comment from state
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const updatedComment = await commentService.updateComment(commentId, {
        content: newContent
      });
      
      // Update the comment in the state
      setComments(comments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
      
      // Exit edit mode
      setEditingComment(null);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const CommentItem = ({ comment }) => {
    const [editContent, setEditContent] = useState(comment.content);
    const isEditing = editingComment === comment.id;

    return (
      <div className="border p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-semibold">
            {comment.author.name} 
            <span className="text-gray-500 ml-2">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="space-x-2">
            {!isEditing ? (
              <button 
                onClick={() => setEditingComment(comment.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            ) : (
              <button 
                onClick={() => setEditingComment(null)}
                className="text-gray-500 hover:text-gray-700 mr-2"
              >
                Cancel
              </button>
            )}
            <button 
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        {isEditing ? (
          <div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
            />
            <button 
              onClick={() => handleEditComment(comment.id, editContent)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        ) : (
          <p>{comment.content}</p>
        )}
      </div>
    );
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error loading post: {error}</div>;
  if (!post) return <div>No post found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Back to Posts
      </button>

      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

      <div className="text-sm text-gray-600 mb-4">
        Author: {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
      </div>

      <div className="prose mb-8">{post.content}</div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded"
            rows="4"
            required
          ></textarea>
          <button 
            type="submit" 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Comment
          </button>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet</p>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostDetail;