import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './authService';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';

// Register User
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
      //  console.log('🟢 [SLICE] registerUser thunk called with:', userData);
        
        try {
            const result = await authService.register(userData);
          //  console.log('🟢 [SLICE] registerUser result:', result);
            
            if (!result.success) {
               // console.log('🔴 [SLICE] Registration failed, rejecting with value:', result.error);
                return rejectWithValue(result.error);
            }
            
           // console.log('✅ [SLICE] Registration successful, returning data:', result.data);
            return result.data;
        } catch (error) {
           // console.error('🔴 [SLICE] Unexpected error in registerUser:', error);
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

// Login User
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
      //  console.log('🟢 [SLICE] loginUser thunk called with:', credentials.email);
        
        try {
            const result = await authService.login(credentials);
           // console.log('🟢 [SLICE] loginUser result:', result);
            
            if (!result.success) {
              //  console.log('🔴 [SLICE] Login failed, rejecting with value:', result.error);
                return rejectWithValue(result.error);
            }
            
          //  console.log('✅ [SLICE] Login successful, returning data:', result.data);
            return result.data;
        } catch (error) {
          //  console.error('🔴 [SLICE] Unexpected error in loginUser:', error);
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {  // Remove 'dispatch' if not needed
       // console.log('🟢 [SLICE] logoutUser thunk called');
        
        try {
            const result = await authService.logout();
           // console.log("logout Response : ", result);
            
            // Fix the condition - check result.success first
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            
           
            
            return result.data;
        } catch (error) {
          //  console.error('🔴 [SLICE] Unexpected error in logoutUser:', error);
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

const initialState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    suggestedUsers: [], // New state for suggested users
    userProfile: null, // New state for user profile
    selectedUser: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
          //  console.log('🧹 [SLICE] Error cleared');
        },
        resetAuthState: () => initialState,
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
             //console.log('✅ [SLICE] Suggested users updated:', action.payload);
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
           // console.log('✅ [SLICE] User profile updated:', action.payload);
        },
        setAuthUser:(state, action) => {
            state.user = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // REGISTER CASES
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
              //  console.log('⏳ [SLICE] Register: PENDING');
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                //console.log('✅ [SLICE] Register: FULFILLED', action.payload);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Registration failed';
               // console.error('❌ [SLICE] Register: REJECTED', action.payload);
            })
            
            // LOGIN CASES
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
               // console.log('⏳ [SLICE] Login: PENDING');
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
                // console.log('✅ [SLICE] Login: FULFILLED', {
                //     user: action.payload.user,
                //     isAuthenticated: true
                // });
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload || 'Login failed';
                //console.error('❌ [SLICE] Login: REJECTED', action.payload);
            })
            
            // LOGOUT CASES
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                //console.log('⏳ [SLICE] Logout: PENDING');
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                //console.log('✅ [SLICE] Logout: FULFILLED');
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Logout failed';
               // console.error('❌ [SLICE] Logout: REJECTED', action.payload);
            });
    },
});

export const { clearError, resetAuthState, setSuggestedUsers, setUserProfile, setAuthUser, setSelectedUser } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectSuggestedUsers = (state) => state.auth.suggestedUsers;
export const selectUserProfile = (state) => state.auth.userProfile;
export default authSlice.reducer;