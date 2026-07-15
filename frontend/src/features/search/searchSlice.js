// features/search/searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'sonner';

// ✅ FIXED: Search Posts API
export const searchPosts = createAsyncThunk(
    'search/searchPosts',
    async ({ query, filter = 'all', page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/search/posts', {
                params: { 
                    q: query, 
                    filter, 
                    page, 
                    limit 
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to search posts';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// ✅ FIXED: Search Users API
export const searchUsers = createAsyncThunk(
    'search/searchUsers',
    async ({ query, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/search/users', {
                params: { q: query, page, limit },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to search users';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// ✅ FIXED: Search Hashtags API
export const searchHashtags = createAsyncThunk(
    'search/searchHashtags',
    async ({ query, page = 1, limit = 10 }, { rejectWithValue }) => {
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

// ✅ FIXED: Advanced Search API
export const advancedSearch = createAsyncThunk(
    'search/advancedSearch',
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

// ✅ FIXED: Get Trending Topics API
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

const initialState = {
    posts: [],
    users: [],
    hashtags: [],
    trendingTopics: [],
    searchResults: {
        posts: [],
        users: [],
        hashtags: []
    },
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    },
    isLoading: false,
    error: null,
    searchQuery: '',
    activeFilter: 'all',
    advancedFilters: {
        startDate: null,
        endDate: null,
        minLikes: 0,
        maxLikes: null,
        minComments: 0,
        maxComments: null,
        sortBy: 'recent'
    }
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
        },
        setAdvancedFilters: (state, action) => {
            state.advancedFilters = { ...state.advancedFilters, ...action.payload };
        },
        resetAdvancedFilters: (state) => {
            state.advancedFilters = initialState.advancedFilters;
        },
        clearSearchResults: (state) => {
            state.searchResults = {
                posts: [],
                users: [],
                hashtags: []
            };
            state.pagination = initialState.pagination;
            state.error = null;
        },
        setPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        resetSearchState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // Search Posts
            .addCase(searchPosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults.posts = action.payload.posts || action.payload.results || [];
                state.pagination = {
                    currentPage: action.payload.currentPage || action.payload.page || 1,
                    totalPages: action.payload.totalPages || action.payload.pages || 1,
                    totalItems: action.payload.totalItems || action.payload.total || 0,
                    itemsPerPage: action.payload.itemsPerPage || action.payload.limit || 10
                };
            })
            .addCase(searchPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Search failed';
            })
            
            // Search Users
            .addCase(searchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults.users = action.payload.users || action.payload.results || [];
                state.pagination = {
                    currentPage: action.payload.currentPage || action.payload.page || 1,
                    totalPages: action.payload.totalPages || action.payload.pages || 1,
                    totalItems: action.payload.totalItems || action.payload.total || 0,
                    itemsPerPage: action.payload.itemsPerPage || action.payload.limit || 10
                };
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'User search failed';
            })
            
            // Search Hashtags
            .addCase(searchHashtags.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchHashtags.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults.hashtags = action.payload.hashtags || action.payload.results || [];
                state.pagination = {
                    currentPage: action.payload.currentPage || action.payload.page || 1,
                    totalPages: action.payload.totalPages || action.payload.pages || 1,
                    totalItems: action.payload.totalItems || action.payload.total || 0,
                    itemsPerPage: action.payload.itemsPerPage || action.payload.limit || 10
                };
            })
            .addCase(searchHashtags.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Hashtag search failed';
            })
            
            // Advanced Search
            .addCase(advancedSearch.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(advancedSearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.searchResults.posts = action.payload.results || action.payload.posts || [];
                state.pagination = {
                    currentPage: action.payload.currentPage || action.payload.page || 1,
                    totalPages: action.payload.totalPages || action.payload.pages || 1,
                    totalItems: action.payload.totalItems || action.payload.total || 0,
                    itemsPerPage: action.payload.itemsPerPage || action.payload.limit || 10
                };
            })
            .addCase(advancedSearch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Advanced search failed';
            })
            
            // Trending Topics
            .addCase(getTrendingTopics.fulfilled, (state, action) => {
                state.trendingTopics = action.payload.trendingTopics || action.payload.trending || action.payload.hashtags || [];
            })
            .addCase(getTrendingTopics.rejected, (state, action) => {
                state.trendingTopics = [];
                state.error = action.payload || 'Failed to load trending';
            });
    }
});

export const {
    setSearchQuery,
    setActiveFilter,
    setAdvancedFilters,
    resetAdvancedFilters,
    clearSearchResults,
    setPage,
    resetSearchState
} = searchSlice.actions;

export default searchSlice.reducer;