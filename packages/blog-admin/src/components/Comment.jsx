
// src/components/Comment.jsx
import { useState } from 'react';
import { FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';

function Comment({ comment, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleUpdate = () => {
    onUpdate(comment.id, editedContent);
    setIsEditing(false);
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">
            By {comment.author?.name} 
          </p>
          {isEditing ? (
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <p className="text-gray-800">{comment.content}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="p-1 text-green-600 hover:text-green-700"
                title="Save"
              >
                <FiCheck />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment.content);
                }}
                className="p-1 text-gray-600 hover:text-gray-700"
                title="Cancel"
              >
                <FiX />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-blue-600 hover:text-blue-700"
                title="Edit"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1 text-red-600 hover:text-red-700"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;