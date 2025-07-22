import CommentList from './components/CommentList';
import CommentForm from './components/CommentForm';
import { useDispatch } from 'react-redux';
import { addComment } from './feature/comments/commentsSlice';
import { useEffect } from 'react';
import { fetchRandomUserImages } from './feature/comments/commentsSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRandomUserImages(4));
  }, [dispatch]);

  const handleAddComment = (content) => {
    dispatch(addComment({ content }));
  };

  return (
    <main className="bg-slate-100 min-h-screen py-8 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <CommentList />
        <CommentForm onSubmit={handleAddComment} />
      </div>
    </main>
  );
}

export default App;