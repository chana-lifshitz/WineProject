import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  title: '',
  body: '',
  delay: 3000, // זמן להעלמות אוטומטית
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    showMessage: (state, action) => {
      const { title, body, delay } = action.payload;
      state.show = true;
      state.title = title || '';
      state.body = body || '';
      state.delay = delay || 3000;
    },
    hideMessage: (state) => {
      state.show = false;
    },
  },
});

export const { showMessage, hideMessage } = messageSlice.actions;

export default messageSlice.reducer;