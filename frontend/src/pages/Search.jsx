// Search.jsx - Fixed API Integration
import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, X, Filter, Grid, List, Hash, User, Image, Clock, TrendingUp, ChevronLeft, ChevronRight, Sliders, Heart, MessageCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    searchPosts, 
    searchUsers, 
    searchHashtags,
    advancedSearch,
    getTrendingTopics,
    setSearchQuery,
    setActiveFilter,
    clearSearchResults,
    setPage,
    setAdvancedFilters,
    resetAdvancedFilters
} from '../features/search/searchSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const Search = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Redux state
    const { 
        searchQuery, 
        activeFilter, 
        searchResults, 
        pagination,
        isLoading,
        error,
        trendingTopics,
        advancedFilters
    } = useSelector((state) => state.search);
    
    const { user } = useSelector((state) => state.auth);
    
    // Local state
    const [localQuery, setLocalQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [recentSearches, setRecentSearches] = useState([]);
    const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
    const [tempAdvancedFilters, setTempAdvancedFilters] = useState(advancedFilters);

    // Load recent searches
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Load trending topics on mount
    useEffect(() => {
        dispatch(getTrendingTopics());
    }, [dispatch]);

    // Save recent searches
    const saveRecentSearch = (query) => {
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // ✅ FIXED: Handle search with proper API calls
    const handleSearch = useCallback((query, filter = activeFilter, page = 1) => {
        if (!query || !query.trim()) {
            dispatch(clearSearchResults());
            return;
        }

        const trimmedQuery = query.trim();
        dispatch(setSearchQuery(trimmedQuery));
        saveRecentSearch(trimmedQuery);

        // ✅ Call the appropriate API based on filter
        switch(filter) {
            case 'users':
                dispatch(searchUsers({ 
                    query: trimmedQuery, 
                    page: page || 1,
                    limit: 10 
                }));
                break;
            case 'hashtags':
                dispatch(searchHashtags({ 
                    query: trimmedQuery, 
                    page: page || 1,
                    limit: 10 
                }));
                break;
            case 'all':
            case 'posts':
            default:
                dispatch(searchPosts({ 
                    query: trimmedQuery, 
                    filter: filter === 'all' ? 'all' : 'posts',
                    page: page || 1,
                    limit: 10 
                }));
                break;
        }
    }, [activeFilter, dispatch]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localQuery && localQuery.trim()) {
                handleSearch(localQuery);
            } else {
                dispatch(clearSearchResults());
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localQuery, handleSearch, dispatch]);

    // ✅ FIXED: Handle advanced search
    const handleAdvancedSearch = () => {
        if (!localQuery || !localQuery.trim()) {
            toast.error('Please enter a search query');
            return;
        }

        dispatch(advancedSearch({
            query: localQuery.trim(),
            ...tempAdvancedFilters,
            page: 1,
            limit: 10
        }));
        setIsAdvancedSearchOpen(false);
        dispatch(setAdvancedFilters(tempAdvancedFilters));
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            dispatch(setPage(newPage));
            handleSearch(localQuery, activeFilter, newPage);
        }
    };

    const clearSearch = () => {
        setLocalQuery('');
        dispatch(clearSearchResults());
    };

    const removeRecentSearch = (query) => {
        const updated = recentSearches.filter(s => s !== query);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // ✅ FIXED: Render post card with proper data checking
    const renderPostCard = (post) => {
        if (!post) return null;
        
        return (
            <div 
                key={post._id || post.id}
                onClick={() => navigate(`/post/${post._id || post.id}`)}
                className="group relative overflow-hidden rounded-xl cursor-pointer aspect-square bg-gray-100 dark:bg-gray-800"
            >
                <img 
                    src={post.image || post.imageUrl} 
                    alt={post.caption || 'Post'} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Post';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-center gap-2 text-white">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={post.author?.profilePicture} />
                            <AvatarFallback className="bg-purple-500 text-white text-xs">
                                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{post.author?.username || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-white/90">
                        <span className="flex items-center gap-1 text-xs">
                            <Heart size={14} className="fill-white" /> {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                            <MessageCircle size={14} /> {post.comments?.length || 0}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // ✅ FIXED: Render user card
    const renderUserCard = (userData) => {
        if (!userData) return null;
        
        return (
            <div 
                key={userData._id || userData.id}
                onClick={() => navigate(`/profile/${userData._id || userData.id}`)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all"
            >
                <Avatar className="w-12 h-12">
                    <AvatarImage src={userData.profilePicture} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {userData.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">{userData.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{userData.name || userData.fullName || 'No name'}</p>
                </div>
                <span className="text-xs text-gray-400">{userData.followers?.length || 0} followers</span>
            </div>
        );
    };

    // ✅ FIXED: Render hashtag card
    const renderHashtagCard = (hashtag) => {
        if (!hashtag) return null;
        
        return (
            <div 
                key={hashtag._id || hashtag.id}
                onClick={() => setLocalQuery(hashtag.tag)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all"
            >
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Hash size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">#{hashtag.tag}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{hashtag.postsCount || hashtag.count || 0} posts</p>
                </div>
            </div>
        );
    };

    // ✅ FIXED: Get results based on active filter
    const getFilteredResults = () => {
        switch(activeFilter) {
            case 'users':
                return searchResults.users || [];
            case 'hashtags':
                return searchResults.hashtags || [];
            case 'all':
            case 'posts':
            default:
                return searchResults.posts || [];
        }
    };

    const results = getFilteredResults();

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Search
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Find posts, users, and hashtags
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="relative">
                    <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        placeholder="Search for posts, users, hashtags..."
                        className="w-full pl-12 pr-32 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-2xl outline-none transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                        autoFocus
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAdvancedSearchOpen(true)}
                            className="flex items-center gap-1 text-xs"
                        >
                            <Sliders size={14} />
                            Advanced
                        </Button>
                        {localQuery && (
                            <button
                                onClick={clearSearch}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                            >
                                <X size={18} className="text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                    {['all', 'posts', 'users', 'hashtags'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => {
                                dispatch(setActiveFilter(filter));
                                if (localQuery && localQuery.trim()) {
                                    handleSearch(localQuery, filter);
                                }
                            }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                                activeFilter === filter
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            {filter === 'all' && <Filter size={14} />}
                            {filter === 'posts' && <Image size={14} />}
                            {filter === 'users' && <User size={14} />}
                            {filter === 'hashtags' && <Hash size={14} />}
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}

                    <div className="ml-auto flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded transition ${
                                viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''
                            }`}
                        >
                            <Grid size={16} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded transition ${
                                viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''
                            }`}
                        >
                            <List size={16} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Advanced Search Dialog */}
            <Dialog open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Advanced Search</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={tempAdvancedFilters.startDate || ''}
                                    onChange={(e) => setTempAdvancedFilters({
                                        ...tempAdvancedFilters,
                                        startDate: e.target.value
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={tempAdvancedFilters.endDate || ''}
                                    onChange={(e) => setTempAdvancedFilters({
                                        ...tempAdvancedFilters,
                                        endDate: e.target.value
                                    })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Min Likes</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={tempAdvancedFilters.minLikes || ''}
                                    onChange={(e) => setTempAdvancedFilters({
                                        ...tempAdvancedFilters,
                                        minLikes: parseInt(e.target.value) || 0
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Max Likes</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={tempAdvancedFilters.maxLikes || ''}
                                    onChange={(e) => setTempAdvancedFilters({
                                        ...tempAdvancedFilters,
                                        maxLikes: parseInt(e.target.value) || null
                                    })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Sort By</Label>
                            <Select
                                value={tempAdvancedFilters.sortBy || 'recent'}
                                onValueChange={(value) => setTempAdvancedFilters({
                                    ...tempAdvancedFilters,
                                    sortBy: value
                                })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">Most Recent</SelectItem>
                                    <SelectItem value="popular">Most Popular</SelectItem>
                                    <SelectItem value="mostCommented">Most Commented</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setTempAdvancedFilters({});
                                    dispatch(resetAdvancedFilters());
                                }}
                            >
                                Reset Filters
                            </Button>
                            <Button
                                onClick={handleAdvancedSearch}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Results Section */}
            {!localQuery && !searchResults.posts?.length && !searchResults.users?.length && !searchResults.hashtags?.length && (
                <div className="space-y-6">
                    {/* Trending Topics */}
                    {trendingTopics && trendingTopics.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Trending Topics</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {trendingTopics.slice(0, 6).map((topic, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setLocalQuery(topic.tag)}
                                        className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all cursor-pointer group"
                                    >
                                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700">
                                            #{topic.tag}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">
                                            {topic.postsCount || topic.posts || 0} posts
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock size={20} className="text-gray-400" />
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Searches</h2>
                                </div>
                                <button
                                    onClick={() => {
                                        setRecentSearches([]);
                                        localStorage.removeItem('recentSearches');
                                    }}
                                    className="text-sm text-red-500 hover:text-red-600"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map((query, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setLocalQuery(query)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all group"
                                    >
                                        <SearchIcon size={14} className="text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{query}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeRecentSearch(query);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <X size={12} className="text-gray-400 hover:text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-xl" />
                    ))}
                </div>
            )}

            {/* Results */}
            {!isLoading && localQuery && (
                <div>
                    {results && results.length > 0 ? (
                        <>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                {activeFilter === 'all' ? 'All Results' : activeFilter} ({results.length})
                            </h3>
                            
                            {activeFilter === 'users' ? (
                                <div className="space-y-2">
                                    {results.map((item) => renderUserCard(item))}
                                </div>
                            ) : activeFilter === 'hashtags' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {results.map((item) => renderHashtagCard(item))}
                                </div>
                            ) : (
                                <div className={viewMode === 'grid' 
                                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                                    : 'space-y-4'
                                }>
                                    {results.map((item) => renderPostCard(item))}
                                </div>
                            )}
                        </>
                    ) : (
                        // No Results
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <SearchIcon size={32} className="text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                No results found for "{localQuery}"
                            </h3>
                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                                Try different keywords or use advanced filters
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default Search;