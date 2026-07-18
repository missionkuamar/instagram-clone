import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { MoreHorizontal, X, Send } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import axiosInstance from '../services/axiosInstance'
import { toast } from 'sonner'
import { setPosts, updatePostComments } from '@/features/post/postSlice'

const CommentDilog = ({ open, setOpen }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { selectedPost, posts } = useSelector(store => store.post);
    const dispatch = useDispatch();
    
    // ✅ Reference for auto-scroll
    const commentsEndRef = useRef(null);
    const commentsContainerRef = useRef(null);
    
    const [comments, setComments] = useState(selectedPost?.comments || []);
    
    // ✅ Update comments when selectedPost changes
    useEffect(() => {
        if (selectedPost?.comments) {
            setComments(selectedPost.comments);
        }
    }, [selectedPost]);
    
    // ✅ Auto-scroll to bottom when new comment added
    useEffect(() => {
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [comments]);
    
    const changeEventHandler = (e) => setText(e.target.value);
    
    const sendMessageHandler = async () => {
        if (!text.trim()) {
            toast.error("Please enter a comment");
            return;
        }
        
        setIsLoading(true);
        
        try {
            const res = await axiosInstance.post(`/post/${selectedPost?._id}/comment`, 
                { text: text.trim() }, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            //console.log("Comment Response:", res.data);
            
            if (res.data.success) {
                // ✅ Create new comment object
                const newComment = {
                    _id: res.data.comment?._id || Date.now(),
                    text: text.trim(),
                    username: user?.username,
                    userId: user?._id,
                    profilePicture: user?.profilePicture,
                    createdAt: new Date().toISOString(),
                    timestamp: new Date().toLocaleTimeString()
                };
                
                // ✅ Update local comments state
                const updatedComments = [...comments, newComment];
                setComments(updatedComments);
                
                // ✅ Update Redux store - update selectedPost
                const updatedSelectedPost = {
                    ...selectedPost,
                    comments: updatedComments
                };
                
                // ✅ Update posts array in Redux
                const updatedPostsData = posts.map(p =>
                    p._id === selectedPost._id 
                        ? { ...p, comments: updatedComments }
                        : p
                );
                
                dispatch(setPosts(updatedPostsData));
                dispatch(updatePostComments({
                    postId: selectedPost._id,
                    comments: updatedComments
                }));
                
                toast.success(res.data.message || "Comment added!");
                setText(''); // Clear input
            } else {
                toast.error(res.data.message || "Failed to add comment");
            }
        } catch (error) {
          //  console.log("Comment Error:", error);
            toast.error(error.response?.data?.message || "Failed to add comment");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && text.trim() && !isLoading) {
            sendMessageHandler();
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent 
                className="max-w-2xl w-[95%] sm:w-[90%] md:w-full p-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                aria-describedby={undefined}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                    <DialogTitle className="text-lg font-semibold dark:text-white m-0">
                        Comments
                    </DialogTitle>
                    <button 
                        onClick={() => setOpen(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                
                {/* Post Info */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {selectedPost?.author?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm dark:text-white">{selectedPost?.author?.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{selectedPost?.caption}</p>
                    </div>
                </div>
                
                {/* Comments List with Auto-Scroll */}
                <div 
                    ref={commentsContainerRef}
                    className="h-[400px] sm:h-[450px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/30"
                >
                    {comments.map((comment, index) => (
                        <div key={comment._id || index} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={comment?.profilePicture} />
                                <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs">
                                    {comment?.username?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                                    <Link className="font-semibold text-sm dark:text-white hover:text-purple-600">
                                        {comment.username}
                                    </Link>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                        {comment.text}
                                    </p>
                                </div>
                                <div className="flex gap-4 mt-1 px-2">
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {comment.timestamp || 'Just now'}
                                    </span>
                                    <button className="text-xs font-medium text-gray-500 dark:text-gray-500 hover:text-purple-600 transition">
                                        Like
                                    </button>
                                    <button className="text-xs font-medium text-gray-500 dark:text-gray-500 hover:text-purple-600 transition">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {comments.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Be the first to comment!</p>
                        </div>
                    )}
                    
                    {/* ✅ Auto-scroll target */}
                    <div ref={commentsEndRef} />
                </div>
                
                {/* Comment Input */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                {user?.username?.charAt(0).toUpperCase() || 'ME'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1">
                            <input 
                                type="text" 
                                value={text} 
                                onChange={changeEventHandler} 
                                onKeyPress={handleKeyPress}
                                placeholder="Add a comment..." 
                                className="flex-1 outline-none bg-transparent text-sm dark:text-white placeholder:text-gray-500 py-2"
                                disabled={isLoading}
                            />
                            {text.trim() && (
                                <button 
                                    onClick={sendMessageHandler}
                                    disabled={isLoading}
                                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 transition disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDilog