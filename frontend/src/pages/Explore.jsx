// Explore.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Compass,
    TrendingUp,
    Clock,
    Flame,
    Grid,
    List,
    Heart,
    MessageCircle,
    Image,
    User,
    Plus,
    RefreshCw,
    Camera,
    MapPin,
    Utensils,
    Shirt
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const Explore = () => {
    const [activeTab, setActiveTab] = useState('for-you'); // for-you, trending, recent
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const categories = [
        { id: 'all', label: 'All', icon: <Compass size={16} /> },
        { id: 'art', label: 'Art', icon: <Image size={16} /> },
        { id: 'photography', label: 'Photography', icon: <Camera size={16} /> },
        { id: 'travel', label: 'Travel', icon: <MapPin size={16} /> },
        { id: 'food', label: 'Food', icon: <Utensils size={16} /> },
        { id: 'fashion', label: 'Fashion', icon: <Shirt size={16} /> },
    ];

    const tabs = [
        { id: 'for-you', label: 'For You', icon: <Compass size={18} /> },
        { id: 'trending', label: 'Trending', icon: <Flame size={18} /> },
        { id: 'recent', label: 'Recent', icon: <Clock size={18} /> },
    ];

    // Fetch posts
    useEffect(() => {
        fetchPosts();
    }, [activeTab, selectedCategory]);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            // Simulate API call - Replace with actual API
            // const response = await exploreAPI(activeTab, selectedCategory);
            // setPosts(response.data);

            setTimeout(() => {
                const mockPosts = [
                    {
                        id: 1,
                        image: 'https://picsum.photos/400/400?random=1',
                        user: 'user1',
                        username: 'traveler_01',
                        likes: 1245,
                        comments: 89,
                        category: 'travel',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        image: 'https://picsum.photos/400/400?random=2',
                        user: 'user2',
                        username: 'art_lover',
                        likes: 834,
                        comments: 56,
                        category: 'art',
                        createdAt: new Date().toISOString()
                    },
                    // Add more mock posts...
                ];
                setPosts(mockPosts);
                setIsLoading(false);
            }, 800);
        } catch (error) {
            //console.error('Error fetching posts:', error);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
            setIsLoading(false);
        }
    };

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Compass size={28} className="text-purple-600" />
                        Explore
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Discover amazing content from the community
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchPosts}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <RefreshCw size={18} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''
                                }`}
                        >
                            <Grid size={16} className="text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''
                                }`}
                        >
                            <List size={16} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}

                {/* Categories */}
                <div className="flex flex-wrap gap-1 ml-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                    : 'bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : posts.length > 0 ? (
                <div className={viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                    : 'space-y-4'
                }>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => handlePostClick(post.id)}
                            className={viewMode === 'grid'
                                ? 'group relative overflow-hidden rounded-xl cursor-pointer aspect-square'
                                : 'flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl cursor-pointer hover:shadow-lg transition-all'
                            }
                        >
                            {viewMode === 'grid' ? (
                                <>
                                    <img
                                        src={post.image}
                                        alt="Post"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <div className="flex items-center gap-2 text-white">
                                            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                                                {post.username.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium">{post.username}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-white/90">
                                            <span className="flex items-center gap-1 text-xs">
                                                <Heart size={14} className="fill-white" /> {post.likes}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs">
                                                <MessageCircle size={14} /> {post.comments}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-40 h-40 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {post.username.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-800 dark:text-white">
                                                    {post.username}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Posted in {post.category}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Heart size={16} /> {post.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle size={16} /> {post.comments}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Compass size={32} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        No posts to explore
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                        Check back later for new content
                    </p>
                </div>
            )}

            {/* Load More */}
            {posts.length > 0 && !isLoading && (
                <div className="text-center mt-8">
                    <button className="px-6 py-2.5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default Explore;