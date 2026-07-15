import { createSlice } from '@reduxjs/toolkit';


const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: null,
        socketId: null,
        isConnected: false,
    },
    reducers: {
        setSocket: (state, action) => {
            console.log("setSocket",action.payload)
            state.socket = action.payload;
        },
        // setSocketConnection: (state, action) => {
        //     state.isConnected = action.payload;
        // },
        // setSocketId: (state, action) => {
        //     console.log("setSocketId",action.payload)
        //     state.socketId = action.payload;
        // }
    }
})

export const { setSocket, setSocketConnection, setSocketId } = socketSlice.actions;
export default socketSlice.reducer;