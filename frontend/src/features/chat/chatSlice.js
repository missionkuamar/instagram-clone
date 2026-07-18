import { createSlice } from '@reduxjs/toolkit';
const initialState = {
        onlineUsers: [],
        messages: [],
    }
    
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        resetChatState: () => initialState,
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages:(state, action) => {
           // console.log(action.payload);
            state.messages = action.payload;
        }
    }
});

export const { setOnlineUsers, setMessages, resetChatState } = chatSlice.actions;

export default chatSlice.reducer;