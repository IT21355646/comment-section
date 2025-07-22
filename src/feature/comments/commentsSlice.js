import { createSlice, nanoid } from '@reduxjs/toolkit';
import amyrobsonImage from '../../assets/react.svg'; // We will create this folder and add images later
import maxblagunImage from '../../assets/react.svg';
import ramsesmironImage from '../../assets/react.svg';
import juliusomoImage from '../../assets/react.svg';

const initialState = {
  currentUser: {
    image: juliusomoImage,
    username: 'juliusomo',
  },
  comments: [
    {
      id: 1,
      content:
        "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      createdAt: '1 month ago',
      score: 12,
      user: {
        image: amyrobsonImage,
        username: 'amyrobson',
      },
      replies: [],
    },
    {
      id: 2,
      content:
        "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      createdAt: '2 weeks ago',
      score: 5,
      user: {
        image: maxblagunImage,
        username: 'maxblagun',
      },
      replies: [
        {
          id: 3,
          content:
            "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          createdAt: '1 week ago',
          score: 4,
          replyingTo: 'maxblagun',
          user: {
            image: ramsesmironImage,
            username: 'ramsesmiron',
          },
        },
        {
          id: 4,
          content:
            "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
          createdAt: '2 days ago',
          score: 2,
          replyingTo: 'ramsesmiron',
          user: {
            image: juliusomoImage,
            username: 'juliusomo',
          },
        },
      ],
    },
  ],
};


const findCommentById = (comments, commentId) => {
  for (const comment of comments) {
    if (comment.id === commentId) return comment;
    if (comment.replies?.length > 0) {
      const foundInReply = findCommentById(comment.replies, commentId);
      if (foundInReply) return foundInReply;
    }
  }
  return null;
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    upvoteComment: (state, action) => {
      const comment = findCommentById(state.comments, action.payload);
      if (comment) comment.score += 1;
    },
    downvoteComment: (state, action) => {
      const comment = findCommentById(state.comments, action.payload);
      if (comment && comment.score > 0) comment.score -= 1;
    },
    addComment: (state, action) => {
      const newComment = {
        id: nanoid(),
        content: action.payload.content,
        createdAt: 'Just now',
        score: 0,
        user: state.currentUser,
        replies: [],
      };
      state.comments.push(newComment);
    },
    addReply: (state, action) => {
      const { parentId, content, replyingTo } = action.payload;
      const parentComment = findCommentById(state.comments, parentId);
      if (parentComment) {
        const newReply = {
          id: nanoid(),
          content,
          createdAt: 'Just now',
          score: 0,
          replyingTo,
          user: state.currentUser,
        };
        const topLevelParent = state.comments.find(c => c.id === parentId || c.replies?.some(r => r.id === parentId));
        if (topLevelParent) {
            topLevelParent.replies.push(newReply);
        }
      }
    },
  },
});

export const { upvoteComment, downvoteComment, addComment, addReply } = commentsSlice.actions;
export default commentsSlice.reducer;