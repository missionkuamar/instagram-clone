// Search.jsx - Simple Main Component
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TrendingUp } from 'lucide-react';
import { getTrendingTopics, setActiveTab } from '../features/search/searchSlice';
import PostsSearch from '../components/search/PostsSearch';
import UsersSearch from '../components/search/UsersSearch';
import HashtagsSearch from '../components/search/HashtagsSearch';

const Search = () => {
    const dispatch = useDispatch();
    const { activeTab, trendingTopics } = useSelector((state) => state.search);

    useEffect(() => {
        dispatch(getTrendingTopics());
    }, [dispatch]);

    const tabs = [
        { id: 'posts', label: 'Posts', component: <PostsSearch /> },
        { id: 'users', label: 'Users', component: <UsersSearch /> },
      
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Search</h1>
                <p className="text-gray-500 dark:text-gray-400">Find posts, users, and hashtags</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => dispatch(setActiveTab(tab.id))}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Trending Topics */}
            {trendingTopics.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={18} className="text-purple-600" />
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Trending</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {trendingTopics.slice(0, 8).map((topic, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-full text-sm cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-950/50 transition"
                            >
                                #{topic.tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Tab Content */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                {tabs.find(tab => tab.id === activeTab)?.component}
            </div>
        </div>
    );
};

export default Search;