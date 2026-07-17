import { createSlice } from "@reduxjs/toolkit";

const  initialState = {
        likeNotification: [],
    }

const rtnSlice = createSlice({
    name: 'realTimeNotification',
   initialState,
    reducers: {
        resetRealTimeNotificationState: () => initialState,
        setLikeNotification: (state, action) => {
            if (action.payload.type === 'like') {
                // Add new notification with read: false
                state.likeNotification.push({
                    ...action.payload,
                    read: false,
                    createdAt: new Date().toISOString()
                });
            } else if (action.payload.type === 'dislike') {
                // Remove notification when user unlikes
                state.likeNotification = state.likeNotification.filter(
                    (item) => item.userId !== action.payload.userId
                );
            }
        },
        // ✅ New reducer to mark all notifications as read
        markNotificationsAsRead: (state) => {
            state.likeNotification = state.likeNotification.map(notif => ({
                ...notif,
                read: true
            }));
        },
        // ✅ New reducer to mark a single notification as read
        markSingleNotificationAsRead: (state, action) => {
            const index = state.likeNotification.findIndex(
                notif => notif._id === action.payload || notif.id === action.payload
            );
            if (index !== -1) {
                state.likeNotification[index].read = true;
            }
        },
        // ✅ Clear all notifications
        clearAllNotifications: (state) => {
            state.likeNotification = [];
        }
    }
});

export const { 
    setLikeNotification, 
    markNotificationsAsRead, 
    markSingleNotificationAsRead,
    clearAllNotifications,
    resetRealTimeNotificationState, 
} = rtnSlice.actions;

export default rtnSlice.reducer;