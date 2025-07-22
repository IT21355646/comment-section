import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const MAX_COMMENT_LENGTH = 250;

const CommentForm = ({ onSubmit, buttonText = 'SEND', placeholder = 'Add a comment...' }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const currentUser = useSelector((state) => state.comments.currentUser);
  const [commentValue, setCommentValue] = useState('');
  const [maxError, setMaxError] = useState('');

  const onFormSubmit = (data) => {
    onSubmit(data.commentText);
    setCommentValue('');
    setMaxError('');
    reset();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_COMMENT_LENGTH) {
      setCommentValue(value);
      setMaxError('');
    } else {
      setMaxError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="mt-4 bg-white p-4 rounded-lg shadow-sm flex items-start space-x-4"
    >
      <img src={currentUser.image} alt={currentUser.username} className="w-10 h-10 rounded-full" />
      <div className="flex-grow">
        <textarea
          {...register('commentText', {
            required: 'Comment cannot be empty',
            validate: value =>
              value.length <= MAX_COMMENT_LENGTH || `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`
          })}
          value={commentValue}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg ${
            errors.commentText || maxError ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          rows="3"
          placeholder={placeholder}
        ></textarea>
        {/* Show empty error if commentValue is empty */}
        {errors.commentText?.type === 'required' && commentValue === '' && (
          <p className="text-red-500 text-sm mt-1">{errors.commentText.message}</p>
        )}
        {errors.commentText?.type !== 'required' && errors.commentText && (
          <p className="text-red-500 text-sm mt-1">{errors.commentText.message}</p>
        )}
        {maxError && <p className="text-red-500 text-sm mt-1">{maxError}</p>}
        <div className="text-xs text-gray-400 mt-1 text-right">{commentValue.length}/{MAX_COMMENT_LENGTH}</div>
      </div>
      <button
        type="submit"
        className="bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-500 transition-colors h-fit"
        disabled={!!maxError}
      >
        {buttonText}
      </button>
    </form>
  );
};

export default CommentForm;