import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { BookMarked, Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import CommentDilog from './CommentDilog'
import { useSelector } from 'react-redux'
import axiosInstance from '../services/axiosInstance'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setPosts, deletePost, updatePostLike, setSelectedPost } from '@/features/post/postSlice'
const Post = ({ post }) => {
    const { user } = useSelector(store => store.auth);
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false);
    const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
    const [saved, setSaved] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [postLike, setPostLike] = useState(post?.likes?.length || 0);
    const [comment, setComment] = useState(post?.comments || []);
    const { posts } = useSelector(store => store.post);

    const dispatch = useDispatch();
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
            console.log("Comment Response:", res.data);
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
            console.log(error);
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

            console.log("Response Data:", response.data);

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
            console.log(error);
            toast.error("Failed to update like");
        }
    }
    const deletePostHandler = async (post) => {
        try {
            const response = await axiosInstance.delete(`/post/delete/${post?._id}`, {
                withCredentials: true
            });

            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(deletePost(post?._id));  // ✅ Sirf ID bhejo
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete post");
        }
    }
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
                            CN
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-sm dark:text-white'>{post?.author?.username}</h1>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>{post?.createdAt || 'create at abhi nhi hai ese improve kro'} </p>
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
                        <DialogDescription>

                        </DialogDescription>
                        <Button variant='ghost' className='cursor-pointer w-full text-[#ED4956] font-bold hover:bg-red-50 dark:hover:bg-red-950/20'>
                            Unfollow
                        </Button>
                        <Button variant='ghost' className='cursor-pointer w-full text-purple-600 font-bold hover:bg-purple-50 dark:hover:bg-purple-950/20'>
                            Add To Favourites
                        </Button>
                        {user?._id === post?.author?._id && (
                            <Button variant='ghost' className='cursor-pointer w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/20'
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
                />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    <Heart
                        className={`cursor-pointer transition-all duration-200 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300 hover:text-red-500'}`}
                        size={24}
                        onClick={() => likeOrDislikeHandler(post)}
                    />
                    <MessageCircle
                        className='cursor-pointer text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'
                        size={24}

                        onClick={() => {setOpen(true), dispatch(setSelectedPost(post))}}
                    />
                    <Send className='cursor-pointer text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors' size={24} />
                </div>
                <BookMarked
                    className={`cursor-pointer transition-all duration-200 ${saved ? 'fill-purple-600 text-purple-600' : 'text-gray-700 dark:text-gray-300 hover:text-purple-600'}`}
                    size={24}
                    onClick={() => setSaved(!saved)}
                />
            </div>

            {/* Likes and Caption */}
            <div className='px-4 pb-2'>
                <span className="font-semibold text-sm dark:text-white block mb-1">
                    {post?.likes?.length || 0} likes
                </span>
                <p className='text-sm dark:text-gray-300'>
                    <span className="font-semibold mr-2 dark:text-white">{post?.author?.username}</span>
                    <span className='text-gray-700 dark:text-gray-400'>{post?.caption}</span>
                </p>
                {post?.comments?.length > 0 && (
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1 cursor-pointer'
                        onClick={() => {setOpen(true), dispatch(setSelectedPost(post))}}
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