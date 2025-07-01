import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  user_name: string | null;
  firstName: string | null;
  lastName: string | null;
  profilePhotoUrl?: string | null;
  about?: string | null;
  position?: string | null;
}

interface PostContent {
  links: string[];
  media: string[];
  text: string;
}

interface Reaction {
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
  kind: string;
  activity_id: string;
  data: {
    text?: {
      text: string;
    };
    likeType?: string;
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      profilePhoto?: string;
      username?: string | null;
      about?: string | null;
      position?: string;
    };
  };
  parent: string;
  latest_children: Record<string, any[]>;
  children_counts: Record<string, number>;
}

interface PostSettings {
  commentSettings: string;
  visibility: string;
}

interface Post {
  id: string;
  post_id: string;
  actor: string;
  author: User;
  content: PostContent | string;
  created_at: string;
  updated_at: string;
  foreign_id: string;
  object: string;
  postSettings: PostSettings;
  latest_reactions?: {
    comment?: Reaction[];
    like?: Reaction[];
    rePostWithComment?: Reaction[];
    reShare?: Reaction[];
    save?: Reaction[];
  };
  reaction_counts?: {
    comment?: number;
    like?: number;
    rePostWithComment?: number;
    reShare?: number;
    save?: number;
  };
  verb: string;
  time: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    }
  }
});

export const { 
  setPosts, 
  setLoading, 
  setError, 
  addPost, 
  updatePost, 
  deletePost 
} = postsSlice.actions;

export default postsSlice.reducer;
