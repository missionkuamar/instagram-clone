// features/search/searchSlice.js - Completely Independent
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'sonner';

// ============ POSTS ACTIONS ============
export const searchPosts = createAsyncThunk(
    'search/searchPosts',
    async ({ query = '', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/search/posts', {
                params: { search: query, page, limit, sortBy, sortOrder },
                withCredentials: true
            });
            console.log("search Posts :", response);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to search posts';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const advancedSearchPosts = createAsyncThunk(
    'search/advancedSearchPosts',
    async (filters, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/search/advanced', filters, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Advanced search failed';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// ============ USERS ACTIONS ============
export const searchUsers = createAsyncThunk(
    'search/searchUsers',
    async ({ query = '', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/search/users', {
                params: { search: query, page, limit, sortBy, sortOrder },
                withCredentials: true
            });
           // console.log("search User response :", response);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to search users';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// ============ HASHTAGS ACTIONS ============
export const searchHashtags = createAsyncThunk(
    'search/searchHashtags',
    async ({ query = '', page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/search/hashtags', {
                params: { q: query, page, limit },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to search hashtags';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// ============ TRENDING ============
export const getTrendingTopics = createAsyncThunk(
    'search/getTrendingTopics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/search/trending', {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to load trending topics';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// ============ INITIAL STATE ============
const initialState = {
    // Posts State
    posts: [],
    postsLoading: false,
    postsError: null,
    postsQuery: '',
    postsPagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    postsFilters: {
        sortBy: 'createdAt',
        sortOrder: 'desc'
    },
    postsAdvancedFilters: {
        startDate: '',
        endDate: '',
        minLikes: 0,
        maxLikes: null,
        minComments: 0,
        maxComments: null,
        sortBy: 'recent'
    },

    // Users State
    users: [],
    usersLoading: false,
    usersError: null,
    usersQuery: '',
    usersPagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    usersFilters: {
        sortBy: 'createdAt',
        sortOrder: 'desc'
    },

    // Hashtags State
    hashtags: [],
    hashtagsLoading: false,
    hashtagsError: null,
    hashtagsQuery: '',

    // Common
    trendingTopics: [],
    activeTab: 'posts'
};

// ============ SLICE ============
const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        // Posts
        setPostsQuery: (state, action) => {
            state.postsQuery = action.payload;
        },
        setPostsPagination: (state, action) => {
            state.postsPagination = { ...state.postsPagination, ...action.payload };
        },
        setPostsFilters: (state, action) => {
            state.postsFilters = { ...state.postsFilters, ...action.payload };
        },
        setPostsAdvancedFilters: (state, action) => {
            state.postsAdvancedFilters = { ...state.postsAdvancedFilters, ...action.payload };
        },
        resetPostsAdvancedFilters: (state) => {
            state.postsAdvancedFilters = initialState.postsAdvancedFilters;
        },
        clearPosts: (state) => {
            console.log('call clear Posts')
            state.posts = [];
            state.postsQuery = '';
            state.postsPagination = initialState.postsPagination;
        },

        // Users
        setUsersQuery: (state, action) => {
            state.usersQuery = action.payload;
        },
        setUsersPagination: (state, action) => {
            state.usersPagination = { ...state.usersPagination, ...action.payload };
        },
        setUsersFilters: (state, action) => {
            state.usersFilters = { ...state.usersFilters, ...action.payload };
        },
        clearUsers: (state) => {
            console.log("clearUser call ")
            state.users = [];
            state.usersQuery = '';
            state.usersPagination = initialState.usersPagination;
        },

        // Hashtags
        setHashtagsQuery: (state, action) => {
            state.hashtagsQuery = action.payload;
        },
        clearHashtags: (state) => {
            state.hashtags = [];
            state.hashtagsQuery = '';
        },

        // Common
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        resetSearchState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // Posts
            .addCase(searchPosts.pending, (state) => {
                state.postsLoading = true;
                state.postsError = null;
            })
            .addCase(searchPosts.fulfilled, (state, action) => {
                 console.log("Searc Posts : ", action.payload);
                state.postsLoading = false;
                state.posts = action.payload?.posts || [];
                state.postsPagination = {
                    currentPage: action.payload?.pagination?.currentPage || 1,
                    totalPages: action.payload?.pagination?.totalPages || 1,
                    totalItems: action.payload?.pagination?.totalItems || 0,
                    itemsPerPage: action.payload?.pagination?.itemsPerPage || 10
                };
            })
            .addCase(searchPosts.rejected, (state, action) => {
                state.postsLoading = false;
                state.postsError = action.payload || 'Search failed';
            })

            // Advanced Posts
            .addCase(advancedSearchPosts.pending, (state) => {
                state.postsLoading = true;
                state.postsError = null;
            })
            .addCase(advancedSearchPosts.fulfilled, (state, action) => {
                state.postsLoading = false;
                state.posts = action.payload?.posts || [];
                state.postsPagination = {
                    currentPage: action.payload?.pagination?.currentPage || 1,
                    totalPages: action.payload?.pagination?.totalPages || 1,
                    totalItems: action.payload?.pagination?.totalItems || 0,
                    itemsPerPage: action.payload?.pagination?.itemsPerPage || 10
                };
            })
            .addCase(advancedSearchPosts.rejected, (state, action) => {
                state.postsLoading = false;
                state.postsError = action.payload || 'Advanced search failed';
            })

            // Users
            .addCase(searchUsers.pending, (state) => {
                state.usersLoading = true;
                state.usersError = null;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
              // console.log("searc response payload :", action.payload);
                state.usersLoading = false;
                state.users = action.payload?.users || [];
                state.usersPagination = {
                    currentPage: action.payload?.pagination?.currentPage || 1,
                    totalPages: action.payload?.pagination?.totalPages || 1,
                    totalItems: action.payload?.pagination?.totalItems || 0,
                    itemsPerPage: action.payload?.pagination?.itemsPerPage || 10
                };
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.usersLoading = false;
                state.usersError = action.payload || 'User search failed';
            })

            // Hashtags
            .addCase(searchHashtags.pending, (state) => {
                state.hashtagsLoading = true;
                state.hashtagsError = null;
            })
            .addCase(searchHashtags.fulfilled, (state, action) => {
                state.hashtagsLoading = false;
                state.hashtags = action.payload?.hashtags || [];
            })
            .addCase(searchHashtags.rejected, (state, action) => {
                state.hashtagsLoading = false;
                state.hashtagsError = action.payload || 'Hashtag search failed';
            })

            // Trending
            .addCase(getTrendingTopics.fulfilled, (state, action) => {
                state.trendingTopics = action.payload?.trendingTopics || [];
            })
            .addCase(getTrendingTopics.rejected, (state) => {
                state.trendingTopics = [];
            });
    }
});

export const {
    setPostsQuery,
    setPostsPagination,
    setPostsFilters,
    setPostsAdvancedFilters,
    resetPostsAdvancedFilters,
    clearPosts,
    setUsersQuery,
    setUsersPagination,
    setUsersFilters,
    clearUsers,
    setHashtagsQuery,
    clearHashtags,
    setActiveTab,
    resetSearchState
} = searchSlice.actions;

export default searchSlice.reducer;