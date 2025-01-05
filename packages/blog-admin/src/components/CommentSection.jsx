// src/components/CommentsSection.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import commentService from '../services/commentService';
import Comment from './Comment';
import toast from 'react-hot-toast';

function CommentsSection({ postId }) {
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getCommentsByPostId(postId)
  });

  const createMutation = useMutation({
    mutationFn: (content) => commentService.createComment({ postId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      setNewComment('');
      toast.success('Comment added successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to add comment');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }) => commentService.updateComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      toast.success('Comment updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update comment');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => commentService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      toast.success('Comment deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete comment');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createMutation.mutate(newComment.trim());
    }
  };

  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-2 border border-gray-300 rounded"
          rows="3"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={!newComment.trim()}
        >
          Add Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onUpdate={(id, content) => updateMutation.mutate({ id, content })}
            onDelete={(id) => {
              if (window.confirm('Are you sure you want to delete this comment?')) {
                deleteMutation.mutate(id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentsSection;