// components/search/HashtagsSearch.jsx - Complete Independent
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, X, Hash } from 'lucide-react';
import { searchHashtags, setHashtagsQuery, clearHashtags } from '../../features/search/searchSlice';
import { Skeleton } from '@/components/ui/skeleton';

const HashtagsSearch = () => {
    const dispatch = useDispatch();
    const { hashtags, hashtagsLoading, hashtagsError, hashtagsQuery } = useSelector((state) => state.search);
    
    const [localQuery, setLocalQuery] = useState(hashtagsQuery || '');

    // Search handler
    const handleSearch = useCallback((searchQuery) => {
        if (!searchQuery || !searchQuery.trim()) {
            dispatch(clearHashtags());
            return;
        }
        dispatch(setHashtagsQuery(searchQuery.trim()));
        dispatch(searchHashtags({ query: searchQuery.trim(), page: 1, limit: 20 }));
    }, [dispatch]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localQuery.trim()) {
                handleSearch(localQuery);
            } else {
                dispatch(clearHashtags());
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localQuery, handleSearch, dispatch]);

    // Sync with Redux query
    useEffect(() => {
        if (hashtagsQuery) {
            setLocalQuery(hashtagsQuery);
        }
    }, [hashtagsQuery]);

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Search hashtags..."
                    className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 outline-none transition"
                />
                {localQuery && (
                    <button
                        onClick={() => { setLocalQuery(''); dispatch(clearHashtags()); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    >
                        <X size={16} className="text-gray-400" />
                    </button>
                )}
            </div>

            {/* Results */}
            {hashtagsLoading ? (
                <div className="grid grid-cols-2 gap-3">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                </div>
            ) : localQuery && hashtags.length === 0 ? (
                <div className="text-center py-12">
                    <Hash size={40} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No hashtags found</h3>
                    <p className="text-gray-400 text-sm">Try different keywords</p>
                </div>
            ) : hashtags?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hashtags.map((hashtag) => (
                        <div
                            key={hashtag._id}
                            onClick={() => setLocalQuery(hashtag.tag)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all border border-gray-100 dark:border-gray-800"
                        >
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Hash size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 dark:text-white">#{hashtag.tag}</p>
                                <p className="text-sm text-gray-500">{hashtag.postsCount || hashtag.count || 0} posts</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {hashtagsError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg text-red-600 text-sm">
                    {hashtagsError}
                </div>
            )}
        </div>
    );
};

export default HashtagsSearch;