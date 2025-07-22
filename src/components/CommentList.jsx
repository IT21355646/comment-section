import React from 'react';
import { useSelector } from 'react-redux';
import Comment from './Comment';

const CommentList = () => {
  const comments = useSelector((state) => state.comments.comments);

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;