import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { BookMarked, Heart, MessageCircle, MoreHorizontal, Send, UserPlus, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import CommentDilog from './CommentDilog'
import { useSelector } from 'react-redux'
import axiosInstance from '../services/axiosInstance'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setPosts, deletePost, setSelectedPost } from '@/features/post/postSlice'
import { setUserProfile } from '@/features/auth/authSlice'

const Post = ({ post }) => {
    const { user, userProfile } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    
    // ✅ FIXED: Get initial state from props
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [postLike, setPostLike] = useState(0);
    const [comment, setComment] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const dispatch = useDispatch();

    // ✅ FIXED: Sync all states when post or user changes
    useEffect(() => {
        if (post && user) {
            // Check if post is liked
            setLiked(post?.likes?.includes(user?._id) || false);
            
            // ✅ Check if post is bookmarked - check both post.bookmarks and userProfile.bookmarks
            const isBookmarked = post?.bookmarks?.includes(user?._id) || 
                               userProfile?.bookmarks?.some(b => b?._id === post?._id) ||
                               false;
            setSaved(isBookmarked);
            
            setPostLike(post?.likes?.length || 0);
            setComment(post?.comments || []);
            setIsFollowing(post?.author?.followers?.includes(user?._id) || false);
        }
    }, [post, user, userProfile]);

    // Listen for theme changes
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const changeEventHandler = (event) => {
        const inputText = event.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axiosInstance.post(`/post/${post?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
           // console.log("Comment Response:", res.data);
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            //console.log(error);
             toast.error(
    error.response?.data?.message || "Something went wrong"
  );
        } finally {
            setText('');
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const response = await axiosInstance.get(`/post/${post?._id}/${action}`, {
                withCredentials: true
            });

          //  console.log("Response Data:", response.data);

            if (response.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));

                toast.success(response.data.message);
            }
        } catch (error) {
           // console.log(error);
            toast.error("Failed to update like");
        }
    }

    const deletePostHandler = async (post) => {
        try {
          //  console.log(post)
            const response = await axiosInstance.delete(`/post/delete/${post?._id}`, {
                withCredentials: true
            });
          //  console.log("delete response", response)
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(deletePost(post?._id));
            }
        } catch (error) {
           // console.log(error);
            toast.error("Failed to delete post");
        }
    }

    const followAndUnfollowHandler = async (authorId) => {
        if (!authorId) {
            toast.error("Invalid user");
            return;
        }

        if (authorId === user?._id) {
            toast.error("You cannot follow yourself");
            return;
        }

        setIsLoadingFollow(true);
        try {
         //   console.log("Follow/Unfollow user ID:", authorId);
            
            const response = await axiosInstance.post(`/user/followorunfollow/${authorId}`, {}, {
                withCredentials: true,
            });
            
          //  console.log("Follow/Unfollow response:", response);
            
            if (response.data.success) {
                const newFollowingState = !isFollowing;
                setIsFollowing(newFollowingState);
                
                toast.success(newFollowingState ? `Following ${post?.author?.username}` : `Unfollowed ${post?.author?.username}`);
                
                const updatedPostData = posts.map(p => {
                    if (p._id === post._id) {
                        const updatedAuthor = {
                            ...p.author,
                            followers: newFollowingState 
                                ? [...(p.author.followers || []), user._id] 
                                : (p.author.followers || []).filter(id => id !== user._id)
                        };
                        return { ...p, author: updatedAuthor };
                    }
                    return p;
                });
                dispatch(setPosts(updatedPostData));
            } else {
                toast.error(response.data.message || "Failed to update follow status");
            }
        } catch (error) {
          //  console.log("Follow/Unfollow error:", error);
            toast.error(error.response?.data?.message || error.message || 'Failed to update follow status');
        } finally {
            setIsLoadingFollow(false);
        }
    }

    // ✅ FIXED: Bookmark Handler with proper Redux sync
    const bookMarkHandler = async (post) => {
        try {
           // console.log("Bookmark post ID:", post._id);
            
            const response = await axiosInstance.get(`/post/${post._id}/bookmark`, {
                withCredentials: true,
            });
            
          //  console.log("Bookmark response:", response);
            
            if (response.data.success) {
                // Check if bookmarked from response
                const isBookmarked = response.data.type === 'saved' || 
                                   response.data.isBookmarked || 
                                   response.data.bookmarked;
                
                //console.log('isBookmarked:', isBookmarked);
                
                // ✅ Update local state
                setSaved(isBookmarked);
                
                // ✅ Update toast message
                toast.success(isBookmarked ? 'Post bookmarked successfully' : 'Bookmark removed');
                
                // ✅ Update Redux store - Posts
                const updatedPostData = posts.map(p => {
                    if (p._id === post._id) {
                        let updatedBookmarks;
                        if (isBookmarked) {
                            // Add user ID if not already present
                            updatedBookmarks = p.bookmarks?.includes(user._id) 
                                ? p.bookmarks 
                                : [...(p.bookmarks || []), user._id];
                        } else {
                            // Remove user ID
                            updatedBookmarks = (p.bookmarks || []).filter(id => id !== user._id);
                        }
                        return { ...p, bookmarks: updatedBookmarks };
                    }
                    return p;
                });
                dispatch(setPosts(updatedPostData));
                
                // ✅ Also update userProfile bookmarks
                if (userProfile) {
                    let updatedUserBookmarks;
                    if (isBookmarked) {
                        // Add post to user's bookmarks
                        const alreadyBookmarked = userProfile.bookmarks?.some(b => b._id === post._id);
                        if (!alreadyBookmarked) {
                            updatedUserBookmarks = [...(userProfile.bookmarks || []), post];
                        } else {
                            updatedUserBookmarks = userProfile.bookmarks;
                        }
                    } else {
                        // Remove post from user's bookmarks
                        updatedUserBookmarks = (userProfile.bookmarks || []).filter(b => b._id !== post._id);
                    }
                    
                    dispatch(setUserProfile({
                        ...userProfile,
                        bookmarks: updatedUserBookmarks
                    }));
                }
            }
        } catch (error) {
           // console.log("Bookmark error:", error);
            toast.error(error.response?.data?.message || "Failed to update bookmark");
        }
    };

    return (
        <div className={`
            max-w-2xl mx-auto mb-8 
            bg-white dark:bg-gray-900 
            rounded-xl shadow-sm 
            border border-gray-200 dark:border-gray-800
            overflow-hidden
            transition-all duration-300
        `}>
            {/* Post Header */}
            <div className='flex items-center justify-between p-4'>
                <div className='flex items-center gap-3'>
                    <Avatar className="w-10 h-10 ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900">
                        <AvatarImage src={post?.author?.profilePicture} alt="post_image" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {post?.author?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-sm dark:text-white'>{post?.author?.username}</h1>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {new Date(post?.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' size={20} />
                    </DialogTrigger>
                    <DialogContent className={`
                        bg-white dark:bg-gray-900 
                        flex flex-col items-center text-sm text-center
                        border border-gray-200 dark:border-gray-800
                        rounded-xl
                    `}>
                        <DialogTitle className="dark:text-white">Post Options</DialogTitle>
                        <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
                            Choose an action for this post
                        </DialogDescription>
                        
                        {post?.author?._id && post?.author?._id !== user?._id && (
                            <Button 
                                variant='ghost' 
                                className={`cursor-pointer w-full font-bold hover:bg-opacity-20 ${
                                    isFollowing 
                                        ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800' 
                                        : 'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20'
                                }`}
                                onClick={() => followAndUnfollowHandler(post.author._id)}
                                disabled={isLoadingFollow}
                            >
                                {isLoadingFollow ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        Loading...
                                    </span>
                                ) : isFollowing ? (
                                    <span className="flex items-center gap-2">
                                        <UserMinus size={16} />
                                        Unfollow
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <UserPlus size={16} />
                                        Follow
                                    </span>
                                )}
                            </Button>
                        )}
                        
                        <Button 
                            variant='ghost' 
                            className={`cursor-pointer w-full font-bold hover:bg-opacity-20 ${
                                saved 
                                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20' 
                                    : 'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20'
                            }`}
                            onClick={() => bookMarkHandler(post)}
                        >
                            {saved ? 'Remove from Favourites' : 'Add To Favourites'}
                        </Button>
                        
                        {user?._id === post?.author?._id && (
                            <Button 
                                variant='ghost' 
                                className='cursor-pointer w-full text-[#ED4956] font-bold hover:bg-red-50 dark:hover:bg-red-950/20'
                                onClick={() => deletePostHandler(post)}
                            >
                                Delete
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Post Image */}
            <div className='relative bg-gray-100 dark:bg-gray-800'>
                <img
                    src={post?.image}
                    alt="post_image"
                    className='w-full aspect-square object-cover'
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Post';
                    }}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    <Heart
                        className={`cursor-pointer transition-all duration-200 ${
                            liked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300 hover:text-red-500'
                        }`}
                        size={24}
                        onClick={() => likeOrDislikeHandler(post)}
                    />
                    <MessageCircle
                        className='cursor-pointer text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'
                        size={24}
                        onClick={() => { setOpen(true); dispatch(setSelectedPost(post)); }}
                    />
                    <Send 
                        className='cursor-pointer text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors' 
                        size={24} 
                    />
                </div>
                <BookMarked
                    className={`cursor-pointer transition-all duration-300 ${
                        saved 
                            ? 'fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400' 
                            : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                    size={24}
                    onClick={() => bookMarkHandler(post)}
                />
            </div>

            {/* Likes and Caption */}
            <div className='px-4 pb-2'>
                <span className="font-semibold text-sm dark:text-white block mb-1">
                    {postLike} likes
                </span>
                <p className='text-sm dark:text-gray-300'>
                    <span className="font-semibold mr-2 dark:text-white">{post?.author?.username}</span>
                    <span className='text-gray-700 dark:text-gray-400'>{post?.caption}</span>
                </p>
                {post?.comments?.length > 0 && (
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors'
                        onClick={() => { setOpen(true); dispatch(setSelectedPost(post)); }}
                    >
                        View all {post?.comments?.length} comments
                    </p>
                )}
            </div>

            {/* Comment Input */}
            <div className='flex items-center justify-between gap-2 p-4 border-t border-gray-100 dark:border-gray-800'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='flex-1 outline-none text-sm rounded-lg py-2 px-3 bg-gray-50 dark:bg-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 border border-transparent focus:border-purple-500 transition-all'
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && text.trim()) {
                            commentHandler();
                        }
                    }}
                />
                {text && (
                    <span className='text-purple-600 dark:text-purple-400 font-semibold text-sm cursor-pointer hover:text-purple-700 transition-colors'
                        onClick={commentHandler}>
                        Post
                    </span>
                )}
            </div>

            {/* Comment Dialog */}
            <CommentDilog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Post