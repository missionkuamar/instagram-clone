import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        onlineUsers: [],
        messages: [],
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages:(state, action) => {
            console.log(action.payload);
            state.messages = action.payload;
        }
    }
});

export const { setOnlineUsers, setMessages } = chatSlice.actions;

export default chatSlice.reducer;