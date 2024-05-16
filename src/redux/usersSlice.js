import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, action) {
      const { id, data } = action.payload;
      state[id] = data;
    },
  },
});

export const fetchUser = (userId) => async (dispatch) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await response.json();
    dispatch(setUser({ id: userId, data }));
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const { setUser } = usersSlice.actions;
export default usersSlice.reducer;
