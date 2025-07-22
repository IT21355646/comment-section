import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const CommentForm = ({ onSubmit, buttonText = 'SEND', placeholder = 'Add a comment...' }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const currentUser = useSelector((state) => state.comments.currentUser);

  const onFormSubmit = (data) => {
    onSubmit(data.commentText);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="mt-4 bg-white p-4 rounded-lg shadow-sm flex items-start space-x-4"
    >
      <img src={currentUser.image} alt={currentUser.username} className="w-10 h-10 rounded-full" />
      <div className="flex-grow">
        <textarea
          {...register('commentText', { required: 'Comment cannot be empty' })}
          className={`w-full p-3 border rounded-lg ${
            errors.commentText ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          rows="3"
          placeholder={placeholder}
        ></textarea>
        {errors.commentText && <p className="text-red-500 text-sm mt-1">{errors.commentText.message}</p>}
      </div>
      <button
        type="submit"
        className="bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-500 transition-colors h-fit"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default CommentForm;