import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from "../features/auth/authSlice.js"
import chatSlice from "../features/chat/chatSlice.js"
import searchSlice from '../features/search/searchSlice.js'
import { 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import postSlice from '../features/post/postSlice.js';
import SocketSlice from '../features/socket/SocketSlice.js';
import rtnSlice from '../features/rtnslice/notification.js';
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
     blacklist: ["socketio"],
}

const rootReducer = combineReducers({
auth:authSlice,
  post: postSlice, 
  socketio: SocketSlice,
  chat: chatSlice,
  search: searchSlice,
  realTimeNotification: rtnSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
      ],
      ignoredPaths: ["socketio.socket"],
      ignoredActionPaths: ["payload"],
    },
  }),
});