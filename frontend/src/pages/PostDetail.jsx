// frontend/src/components/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../services/axiosInstance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ArrowLeft, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchPostDetails();
    }, [id]);

    const fetchPostDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/post/${id}`);
            if (response.data.success) {
                setPost(response.data.post);
                setComments(response.data.post.comments || []);
            } else {
                setError('Post not found');
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            if (error.response?.status === 404) {
                setError('Post not found');
            } else {
                setError('Failed to load post');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await axiosInstance.post(`/post/${id}/like`);
            if (response.data.success) {
                setPost({
                    ...post,
                    likes: response.data.likes,
                    isLiked: response.data.isLiked
                });
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const response = await axiosInstance.post(`/post/${id}/comment`, {
                text: comment
            });
            if (response.data.success) {
                setComments([response.data.comment, ...comments]);
                setComment('');
                setPost({
                    ...post,
                    comments: [response.data.comment, ...post.comments]
                });
            }
        } catch (error) {
            console.error('Error commenting:', error);
            toast.error('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await axiosInstance.delete(`/post/${id}/comment/${commentId}`);
            if (response.data.success) {
                setComments(comments.filter(c => c._id !== commentId));
                setPost({
                    ...post,
                    comments: post.comments.filter(c => c._id !== commentId)
                });
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                        {error || 'Post not found'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 mb-6">
                        The post you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition mb-4"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {/* Post Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <Avatar 
                            className="w-10 h-10 cursor-pointer"
                            onClick={() => navigate(`/profile/${post.author?._id}`)}
                        >
                            <AvatarImage src={post.author?.profilePicture} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p 
                                className="font-semibold text-sm hover:underline cursor-pointer dark:text-white"
                                onClick={() => navigate(`/profile/${post.author?._id}`)}
                            >
                                {post.author?.username || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                        <MoreHorizontal size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Post Image */}
                <div className="relative">
                    <img 
                        src={post.image} 
                        alt={post.caption || 'Post'} 
                        className="w-full max-h-[600px] object-contain bg-black/5"
                    />
                </div>

                {/* Post Actions */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleLike}
                                className="hover:scale-110 transition-transform"
                            >
                                <Heart 
                                    size={24} 
                                    className={post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}
                                />
                            </button>
                            <button className="hover:scale-110 transition-transform">
                                <MessageCircle size={24} className="text-gray-700 dark:text-gray-300" />
                            </button>
                            <button className="hover:scale-110 transition-transform">
                                <Share2 size={24} className="text-gray-700 dark:text-gray-300" />
                            </button>
                        </div>
                        <button className="hover:scale-110 transition-transform">
                            <Bookmark size={24} className="text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>

                    <p className="font-semibold text-sm dark:text-white">
                        {post.likes?.length || 0} likes
                    </p>

                    {post.caption && (
                        <div className="flex items-start gap-2">
                            <span className="font-semibold text-sm dark:text-white">
                                {post.author?.username}:
                            </span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                                {post.caption}
                            </p>
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="space-y-3 pt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {comments.length} comments
                        </p>

                        {/* Comment Form */}
                        <form onSubmit={handleComment} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                            />
                            <button
                                type="submit"
                                disabled={!comment.trim()}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {comments.map((comment) => (
                                <div key={comment._id} className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 flex-1">
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={comment.user?.profilePicture} />
                                            <AvatarFallback className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                                {comment.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <span className="font-semibold text-xs dark:text-white">
                                                {comment.user?.username}:
                                            </span>
                                            <span className="text-xs text-gray-700 dark:text-gray-300 ml-1">
                                                {comment.text}
                                            </span>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    {comment.user?._id === user?._id && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="text-red-500 hover:text-red-700 text-xs"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;