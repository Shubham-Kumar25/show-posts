import { createSlice } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {},
  reducers: {
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      state[postId] = comments;
    },
  },
});

export const fetchComments = (postId) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    const data = await response.json();
    dispatch(commentsSlice.actions.setComments({ postId, comments: data }));
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

export default commentsSlice.reducer;
