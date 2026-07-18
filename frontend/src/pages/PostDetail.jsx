// pages/PostDetail.jsx - Complete with Like, Comment, Delete Post & Comment
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, MessageCircle, ArrowLeft, Calendar, Loader2, Send, Trash2, MoreVertical } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    // Fetch post data
    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/search/posts/${id}`, {
                withCredentials: true
            });
            //console.log("response:", response);
            if (response.data.success) {
                const postData = response.data.post;
                setPost(postData);
                setComments(postData.comments || []);
                setLikesCount(postData.likes?.length || 0);
                setLiked(postData.likes?.includes(user?._id));
            }
        } catch (error) {
         //   console.error('Error fetching post:', error);
            setError(error.response?.data?.message || 'Failed to load post');
            toast.error('Failed to load post');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id, user?._id]);

    // Handle Like
    const handleLike = async () => {
        if (!user) {
            toast.error('Please login to like posts');
            return;
        }

        try {
            const action = liked ? 'dislike' : 'like';
            const response = await axiosInstance.get(`/post/${post?._id}/${action}`, {
                withCredentials: true
            });

            if (response.data.success) {
                setLiked(!liked);
                setLikesCount(prev => liked ? prev - 1 : prev + 1);
                toast.success(response.data.message);
            }
        } catch (error) {
          //  console.error('Like error:', error);
            toast.error(error.response?.data?.message || 'Failed to update like');
        }
    };

    // Handle Comment
    const handleComment = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Please login to comment');
            return;
        }

        if (!commentText.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        try {
            setSubmitting(true);
            const response = await axiosInstance.post(
                `/post/${post?._id}/comment`,
                { text: commentText.trim() },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                const newComment = response.data.comment;
                setComments([newComment, ...comments]);
                setCommentText('');
                toast.success('Comment added successfully');
            }
        } catch (error) {
           // console.error('Comment error:', error);
            toast.error(error.response?.data?.message || 'Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Post
    const deletePostHandler = async () => {
        try {
            const response = await axiosInstance.delete(`/post/delete/${post?._id}`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                toast.success('Post deleted successfully');
                navigate(-1);
            }
        } catch (error) {
           // console.error('Delete post error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete post');
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    // Delete Comment
    const deleteCommentHandler = async () => {
        if (!selectedCommentId) return;
        
        try {
            const response = await axiosInstance.delete(`/comment/${selectedCommentId}`, {
                withCredentials: true
            });
//console.log("delete comment  response:", response)
            if (response.data.success) {
                setComments(comments.filter(c => c._id !== selectedCommentId));
                toast.success('Comment deleted successfully');
            }
        } catch (error) {
            //console.error('Delete comment error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete comment');
        } finally {
            setDeleteCommentDialogOpen(false);
            setSelectedCommentId(null);
        }
    };
//console.log("comments : ", setComments)
    // Format date
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
        
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Loading post...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                        Post Not Found
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {error || 'The post you are looking for does not exist.'}
                    </p>
                    <Button onClick={() => navigate(-1)} className="bg-purple-600 hover:bg-purple-700">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition mb-4"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {/* Post Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
                {/* Image */}
                <div className="relative bg-gray-100 dark:bg-gray-800">
                    <img
                        src={post.image || post.imageUrl}
                        alt={post.caption || 'Post'}
                        className="w-full max-h-[600px] object-contain"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=Post';
                        }}
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={post.author?.profilePicture} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p 
                                className="font-semibold text-gray-800 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                                onClick={() => navigate(`/profile/${post.author?._id}`)}
                            >
                                {post.author?.username || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {post.author?.name || ''}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(post.createdAt)}
                            </div>
                            
                            {/* Delete Post - Only for post owner */}
                            {user?._id === post.author?._id && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem 
                                            onClick={() => setDeleteDialogOpen(true)}
                                            className="text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 size={14} className="mr-2" />
                                            Delete Post
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* Caption */}
                    {post.caption && (
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {post.caption}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 transition ${
                                liked 
                                    ? 'text-red-500' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                            }`}
                        >
                            <Heart size={24} className={liked ? 'fill-red-500' : ''} />
                            <span className="font-medium">{likesCount}</span>
                            <span className="text-sm">Likes</span>
                        </button>

                        <button
                            onClick={() => document.getElementById('comment-input')?.focus()}
                            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition"
                        >
                            <MessageCircle size={24} />
                            <span className="font-medium">{comments.length}</span>
                            <span className="text-sm">Comments</span>
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                            Comments ({comments.length})
                        </h3>

                        {/* Comment Input */}
                        {user ? (
                            <form onSubmit={handleComment} className="flex items-center gap-2 mb-4">
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback className="bg-purple-500 text-white text-xs">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 relative">
                                    <input
                                        id="comment-input"
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full px-4 py-2 pr-12 bg-gray-100 dark:bg-gray-800 border-0 rounded-full focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                        disabled={submitting}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting || !commentText.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="text-purple-600 hover:underline"
                                >
                                    Login
                                </button>
                                {' '}to comment
                            </p>
                        )}

                        {/* Comments List */}
                        {comments.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="flex items-start gap-3 group">
                                        <Avatar className="w-8 h-8 flex-shrink-0">
                                            <AvatarImage src={comment.author?.profilePicture} />
                                            <AvatarFallback className="bg-purple-500 text-white text-xs">
                                                {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm break-words">
                                                <span 
                                                    className="font-semibold text-gray-800 dark:text-white cursor-pointer hover:text-purple-600"
                                                    onClick={() => navigate(`/profile/${comment.author?._id}`)}
                                                >
                                                    {comment.author?.username || 'Unknown'}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-300 ml-2">
                                                    {comment.text}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {formatDate(comment.createdAt)}
                                            </p>
                                        </div>
                                        {/* Delete Comment - Only for comment owner */}
                                        {/* {user?._id === comment.author?._id && (
                                            <button
                                                onClick={() => {
                                                    setSelectedCommentId(comment._id);
                                                    setDeleteCommentDialogOpen(true);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition text-xs p-1"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )} */}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">
                                No comments yet. Be the first to comment!
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Post Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} >
                <AlertDialogContent className="bg-gray-100 border border-gray-300">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your post.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={deletePostHandler}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Comment Confirmation Dialog */}
           <AlertDialog open={deleteCommentDialogOpen} onOpenChange={setDeleteCommentDialogOpen}>
    <AlertDialogContent className="bg-gray-100 border border-gray-300">
        <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your comment.
            </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={deleteCommentHandler}
                className="bg-red-600 hover:bg-red-700"
            >
                Delete
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
        </div>
    );
};

export default PostDetail;