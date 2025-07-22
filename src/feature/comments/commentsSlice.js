import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

export const fetchRandomUserImages = createAsyncThunk(
  'comments/fetchRandomUserImages',
  async (count = 4) => {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    const data = await response.json();
    return data.results.map(user => user.picture.large);
  }
);

const initialState = {
  currentUser: {
    image: '',
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
        image: '',
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
        image: '',
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
            image: '',
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
            image: '',
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
  },extraReducers: (builder) => {
    builder.addCase(fetchRandomUserImages.fulfilled, (state, action) => {
      const images = action.payload;

      const userImageMap = {
        'amyrobson': images[0],
        'maxblagun': images[1],
        'ramsesmiron': images[2],
        'juliusomo': images[3],
      };

      // Images in top-level comments
      for (const comment of state.comments) {
        const username = comment.user.username;
        if (userImageMap[username]) {
          comment.user.image = userImageMap[username];
        }

        // Images in replies
        for (const reply of comment.replies) {
          const replyUsername = reply.user.username;
          if (userImageMap[replyUsername]) {
            reply.user.image = userImageMap[replyUsername];
          }
        }
      }

      // Current user image
      const currentUser = state.currentUser.username;
      if (userImageMap[currentUser]) {
        state.currentUser.image = userImageMap[currentUser];
      }
    });
  },
});

export const { upvoteComment, downvoteComment, addComment, addReply } = commentsSlice.actions;
export default commentsSlice.reducer;