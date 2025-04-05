// src/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      // Store in session cookie
      document.cookie = `session=${encodeURIComponent(
        JSON.stringify(action.payload)
      )}; path=/`;
    },
    logout(state) {
      state.user = null;
      document.cookie =
        "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
    loadFromCookie(state) {
      const match = document.cookie.match(/session=([^;]+)/);
      if (match) {
        try {
          state.user = JSON.parse(decodeURIComponent(match[1]));
        } catch {
          state.user = null;
        }
      }
    },
  },
});

export const { loginSuccess, logout, loadFromCookie } = userSlice.actions;
export default userSlice.reducer;
