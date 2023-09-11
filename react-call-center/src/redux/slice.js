import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
    name: 'app',
    initialState: [],
    reducers: {

    }
});

// this is for dispatch
export const { addTodo } = slice.actions;

// this is for configureStore
export default slice.reducer;