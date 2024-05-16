import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    setPosts: (state, action) => {
      return action.payload;
    },
    setPost: (state, action) => {
      const index = state.findIndex((post) => post.id === action.payload.id);
      if (index >= 0) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
    },
  },
});

export const fetchPosts = () => async (dispatch) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const data = await response.json();
    dispatch(postsSlice.actions.setPosts(data));
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};

export const fetchPost = (postId) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch post with ID ${postId}`);
    }
    const data = await response.json();
    dispatch(postsSlice.actions.setPost(data));
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
  }
};

export default postsSlice.reducer;
