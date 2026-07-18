import React, { useRef, useState } from 'react'
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
//import { setPosts } from '@/redux/postSlice';
import axiosInstance from '../services/axiosInstance';
import { setPosts } from '@/features/post/postSlice';
const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post || {});
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  const createPostHandler = async () => {
    // console.log("Caption:", caption);
    // console.log("File:", file);
    
    if (!caption.trim() && !file) {
        toast.error("Please add caption or image");
        return;
    }
    
    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("image", file);
    
    try {
        // ✅ Important: Don't set Content-Type header for FormData
        // Let browser set it automatically with boundary
        const res = await axiosInstance.post('/post/addpost', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // ✅ This is important
            }
        });
        
        //console.log("Response:", res);
        
        if (res.data.success) {
            toast.success(res.data.message || "Post created successfully");
            // Reset form
            setCaption("");
            setFile(null);
            setImagePreview("");
            setOpen(false);
            
            // Update posts if needed
            if (posts && res.data.post) {
                dispatch(setPosts([res.data.post, ...posts]));
            }
        } else {
            toast.error(res.data.message || "Failed to create post");
        }
    } catch (error) {
        console.error("Create post error:", error);
        // Error is already handled by axios interceptor
        // No need to show toast again
    } finally {
        setLoading(false);
    }
}

  const resetForm = () => {
    setCaption("");
    setFile(null);
    setImagePreview("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader className='text-center font-semibold text-lg dark:text-white'>
        <DialogTitle className='text-center font-semibold text-lg dark:text-white'></DialogTitle>
          Create New Post
        </DialogHeader>
        
        {/* User Info */}
        <div className='flex gap-3 items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-sm dark:text-white'>{user?.username || 'Username'}</h1>
            <span className='text-gray-500 dark:text-gray-400 text-xs'>{user?.bio || "Bio here..."}</span>
          </div>
        </div>
        
        {/* Caption Input */}
        <Textarea 
          value={caption} 
          onChange={(e) => setCaption(e.target.value)} 
          className="focus-visible:ring-transparent border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white placeholder:text-gray-500"
          placeholder="Write a caption..." 
          rows={3}
        />
        
        {/* Image Preview */}
        {imagePreview && (
          <div className='w-full h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden'>
            <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full' />
          </div>
        )}
        
        {/* File Input */}
        <input 
          ref={imageRef} 
          type='file' 
          accept="image/*"
          className='hidden' 
          onChange={fileChangeHandler} 
        />
        
        {/* Select Button */}
        <Button 
          onClick={() => imageRef.current.click()} 
          variant="outline"
          className='w-full border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/20'
        >
          Select from computer
        </Button>
        
        {/* Post Button */}
        {imagePreview && (
          loading ? (
            <Button disabled className="w-full bg-purple-600">
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait...
            </Button>
          ) : (
            <Button 
              onClick={createPostHandler} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Post
            </Button>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost