import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './app/store.js';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';


// Listen for auth logout event
window.addEventListener('auth-logout', () => {
    store.dispatch({ type: 'auth/logout' });
});

let persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
   <Provider store={store}>
   <PersistGate loading={null} persistor={persistor}>
            <App />
            <Toaster position="top-right" richColors />
            </PersistGate>
        </Provider>
  //{/* </React.StrictMode>, */}
)
