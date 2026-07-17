// components/search/PostsSearch.jsx - Complete Independent
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, X, Grid, List, Heart, MessageCircle, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    searchPosts,
    advancedSearchPosts,
    setPostsQuery,
    setPostsPagination,
    setPostsFilters,
    setPostsAdvancedFilters,
    resetPostsAdvancedFilters,
    clearPosts
} from '../../features/search/searchSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const PostsSearch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        posts,
        postsLoading,
        postsError,
        postsPagination,
        postsQuery,
        postsFilters,
        postsAdvancedFilters
    } = useSelector((state) => state.search);

    const [localQuery, setLocalQuery] = useState(postsQuery || '');
    const [viewMode, setViewMode] = useState('grid');
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [tempAdvanced, setTempAdvanced] = useState(postsAdvancedFilters);
    const [limit, setLimit] = useState(10);

    // Search handler
   const handleSearch = useCallback((searchQuery = "", page = 1) => {

    dispatch(setPostsQuery(searchQuery));

    dispatch(searchPosts({
        query: searchQuery,
        page,
        limit,
        sortBy: postsFilters.sortBy,
        sortOrder: postsFilters.sortOrder
    }));

}, [dispatch, limit, postsFilters.sortBy, postsFilters.sortOrder]);



    useEffect(() => {
        const timer = setTimeout(() => {
            if (localQuery.trim()) {
                handleSearch(localQuery);
            } else {
                dispatch(searchPosts({
                    query: "",
                    page: 1,
                    limit,
                    sortBy: postsFilters.sortBy,
                    sortOrder: postsFilters.sortOrder,
                }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localQuery, dispatch, handleSearch]);


    
    useEffect(() => {
        dispatch(
            searchPosts({
                query: "",
                page: 1,
                limit: 10,
                sortBy: "createdAt",
                sortOrder: "desc",
            })
        );
    }, [dispatch]);


    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localQuery.trim()) {
                handleSearch(localQuery);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localQuery, handleSearch]);

    const clearSearch = () => {
        setLocalQuery("");
        dispatch(clearPosts());
    };

    // Sync with Redux query
    useEffect(() => {
        if (postsQuery) {
            setLocalQuery(postsQuery);
        }
    }, [postsQuery]);

    // Advanced search
    const handleAdvancedSearch = () => {
        if (!localQuery.trim()) {
            toast.error('Please enter a search query');
            return;
        }

        dispatch(advancedSearchPosts({
            query: localQuery.trim(),
            ...tempAdvanced,
            page: 1,
            limit
        }));
        dispatch(setPostsAdvancedFilters(tempAdvanced));
        setIsAdvancedOpen(false);
    };

    // Pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= postsPagination.totalPages) {
            handleSearch(localQuery, newPage);
        }
    };

    // Limit change
    const handleLimitChange = (newLimit) => {
        setLimit(parseInt(newLimit));
        dispatch(setPostsPagination({ itemsPerPage: parseInt(newLimit) }));
        if (localQuery.trim()) {
            handleSearch(localQuery, 1);
        }
    };

    // Sort change
    const handleSortChange = (field, value) => {
        dispatch(setPostsFilters({ [field]: value }));
        if (localQuery.trim()) {
            handleSearch(localQuery, 1);
        }
    };

    // Render post card
    const renderPostCard = (post) => {
        if (!post) return null;
        return (
            <div
                key={post._id}
                onClick={() => navigate(`/post/${post._id}`)}
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

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-28 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none transition"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAdvancedOpen(true)}
                        className="text-xs"
                    >
                        <Sliders size={14} />
                    </Button>
                    {localQuery && (
                        <button
                            onClick={() => { setLocalQuery(''); dispatch(clearPosts()); }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                        >
                            <X size={16} className="text-gray-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 ">
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={limit.toString()} onValueChange={handleLimitChange}
                        >
                        <SelectTrigger className="w-20 h-8 text-xs">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent
                            position="popper"
                            side="bottom"
                            sideOffset={5}
                            className="z-50 min-w-[80px] bg-white">

                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={postsFilters.sortBy}
                        onValueChange={(value) => handleSortChange('sortBy', value)}
                    >
                        <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent
                        position="popper"
                            side="bottom"
                            sideOffset={5}
                            className="z-50 min-w-[80px] bg-white">
                            <SelectItem value="createdAt">Date</SelectItem>
                            <SelectItem value="likes">Likes</SelectItem>
                            <SelectItem value="comments">Comments</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={postsFilters.sortOrder}
                        onValueChange={(value) => handleSortChange('sortOrder', value)}
                    >
                        <SelectTrigger className="w-24 h-8 text-xs">
                            <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent
                        position="popper"
                            side="bottom"
                            sideOffset={5}
                            className="z-50 min-w-[80px] bg-white">
                            <SelectItem value="desc">Desc</SelectItem>
                            <SelectItem value="asc">Asc</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shrink-0">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                    >
                        <Grid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                    >
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* Advanced Search Dialog */}
            <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Advanced Search - Posts</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={tempAdvanced?.startDate || ''}
                                    onChange={(e) => setTempAdvanced({ ...tempAdvanced, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={tempAdvanced?.endDate || ''}
                                    onChange={(e) => setTempAdvanced({ ...tempAdvanced, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Min Likes</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={tempAdvanced?.minLikes || ''}
                                    onChange={(e) => setTempAdvanced({ ...tempAdvanced, minLikes: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <Label>Max Likes</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={tempAdvanced?.maxLikes || ''}
                                    onChange={(e) => setTempAdvanced({ ...tempAdvanced, maxLikes: parseInt(e.target.value) || null })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Sort By</Label>
                            <Select
                                value={tempAdvanced?.sortBy || 'recent'}
                                onValueChange={(value) => setTempAdvanced({ ...tempAdvanced, sortBy: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent
                                 position="popper"
                            side="bottom"
                            sideOffset={5}
                            className="z-50 min-w-[80px] bg-white"
                                >
                                    <SelectItem value="recent">Most Recent</SelectItem>
                                    <SelectItem value="popular">Most Popular</SelectItem>
                                    <SelectItem value="mostCommented">Most Commented</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" onClick={() => {
                                setTempAdvanced({ startDate: '', endDate: '', minLikes: 0, maxLikes: null, minComments: 0, maxComments: null, sortBy: 'recent' });
                                dispatch(resetPostsAdvancedFilters());
                            }} className="flex-1">
                                Reset
                            </Button>
                            <Button onClick={handleAdvancedSearch} className="flex-1 bg-purple-600 hover:bg-purple-700">
                                Apply
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Results */}
            {postsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-xl" />
                    ))}
                </div>
            ) : localQuery && posts.length === 0 ? (
                <div className="text-center py-12">
                    <Search size={40} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No posts found</h3>
                    <p className="text-gray-400 text-sm">Try different keywords</p>
                </div>
            ) : posts?.length > 0 && (
                <>
                    <div className="text-sm text-gray-500">
                        Showing {posts.length} of {postsPagination.totalItems} posts
                    </div>
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 gap-4'
                        : 'space-y-3'
                    }>
                        {posts.map(renderPostCard)}
                    </div>

                    {/* Pagination */}
                    {postsPagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(postsPagination.currentPage - 1)}
                                disabled={postsPagination.currentPage === 1 || postsLoading}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <span className="text-sm">
                                Page {postsPagination.currentPage} of {postsPagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(postsPagination.currentPage + 1)}
                                disabled={postsPagination.currentPage === postsPagination.totalPages || postsLoading}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {postsError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg text-red-600 text-sm">
                    {postsError}
                </div>
            )}
        </div>
    );
};

export default PostsSearch;