import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { upvoteComment, downvoteComment, addReply } from '../feature/comments/commentsSlice';
import CommentForm from './CommentForm';

const Comment = ({ comment }) => {
  const dispatch = useDispatch();
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const currentUser = useSelector((state) => state.comments.currentUser);
  const isCurrentUser = comment.user.username === currentUser.username;

  const handleAddReply = (content) => {
    dispatch(addReply({ parentId: comment.id, content, replyingTo: comment.user.username }));
    setIsReplying(false);
  };

  if (isDeleted) return null; // Mock deletion - Hide comment if deleted

  return (
    <>
      <div className="flex bg-white p-4 rounded-lg shadow-sm space-x-4">
        {/* Vote Counter */}
        <div className="flex flex-col items-center space-y-2 bg-slate-100 p-2 rounded-lg h-fit">
          <button onClick={() => dispatch(upvoteComment(comment.id))} className="text-slate-400 hover:text-indigo-600 font-bold text-lg">+</button>
          <span className="font-bold text-blue-900">{comment.score}</span>
          <button onClick={() => dispatch(downvoteComment(comment.id))} className="text-slate-400 hover:text-indigo-600 font-bold text-lg">-</button>
        </div>

        {/* Comment Content */}
        <div className="w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img src={comment.user.image} alt={comment.user.username} className="w-8 h-8 rounded-full" />
              <span className="font-bold text-blue-900">{comment.user.username}</span>
              {isCurrentUser && <span className="bg-blue-900 text-white text-xs font-medium px-2 py-0.5 rounded-sm">you</span>}
              <span className="text-slate-500">{comment.createdAt}</span>
            </div>
            {isCurrentUser ? (
                <div className="flex space-x-4">
                    <button
                      className="text-red-500 font-bold hover:text-red-300 flex items-center space-x-1"
                      onClick={() => setIsDeleted(true)} // Hide comment on delete
                    >
                      {/* Delete icon */}
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12z" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      <span>Delete</span>
                    </button>
                    <button className="text-blue-900 font-bold hover:text-blue-600 flex items-center space-x-1">
                      {/* Edit icon */}
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.414 2.586a2 2 0 010 2.828l-10 10A2 2 0 016 16H4a1 1 0 01-1-1v-2a2 2 0 01.586-1.414l10-10a2 2 0 012.828 0zM15 4l1 1-10 10H5v-1L15 4z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsReplying(!isReplying)} className="text-blue-900 font-bold hover:text-blue-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Reply
                </button>
            )}
          </div>
          <p className="mt-3 text-slate-600">
             {comment.replyingTo && <span className="font-bold text-blue-900">@{comment.replyingTo} </span>}
             {comment.content}
          </p>
        </div>
      </div>

      {isReplying && (
        <div className="mt-4">
           <CommentForm onSubmit={handleAddReply} buttonText="REPLY" placeholder={`Replying to @${comment.user.username}...`} />
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="pl-6 md:pl-10 mt-4 border-l-2 border-slate-200">
          <div className="space-y-4">
            {comment.replies.map((reply) => <Comment key={reply.id} comment={reply} />)}
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;