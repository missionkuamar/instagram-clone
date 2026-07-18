import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../features/auth/authSlice';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector(store => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePhoto,
    bio: user?.bio || '',
    gender: user?.gender || ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

 // console.log(user);
 const editProfileHandler = async () => {
  // 🔍 STEP 1: Initial input data check
  // console.log('🔍 STEP 1 - Initial Input State:', {
  //   bio: input.bio,
  //   gender: input.gender,
  //   profilePhoto: input.profilePhoto,
  //   profilePhotoType: typeof input.profilePhoto,
  //   isFile: input.profilePhoto instanceof File
  // });

  const formData = new FormData();
  formData.append('bio', input.bio);
  formData.append('gender', input.gender);
  
  // 🔍 STEP 2: Check if file is being added
  if (input.profilePhoto && typeof input.profilePhoto !== 'string') {
    formData.append("profilePhoto", input.profilePhoto);
    // console.log('🔍 STEP 2 - File added to FormData:', {
    //   fileName: input.profilePhoto.name,
    //   fileSize: input.profilePhoto.size,
    //   fileType: input.profilePhoto.type
    // });
  } else {
   // console.log('🔍 STEP 2 - No new file selected, keeping existing photo');
    toast.error(
     "Something went wrong in edit profile handler"
  );
  }

  // 🔍 STEP 3: Check FormData contents (iterate through all entries)
  //console.log('🔍 STEP 3 - FormData entries:');
  for (let pair of formData.entries()) {
    if (pair[0] === 'profilePhoto' && pair[1] instanceof File) {
      //console.log(`   ${pair[0]}: [File] ${pair[1].name} (${pair[1].size} bytes)`);
    } else {
    //  console.log(`   ${pair[0]}: ${pair[1]}`);
     toast.error(
    "Something went wrong"
  );
    }
  }

  try {
    setLoading(true);
  //  console.log('🔍 STEP 4 - Sending request to backend...');
    
    const res = await axiosInstance.post(`/user/profile/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    
    // 🔍 STEP 5: Response received successfully
    // console.log('🔍 STEP 5 - Response received:', {
    //   status: res.status,
    //   statusText: res.statusText,
    //   data: res.data,
    //   fullResponse: res
    // });
    
    if (res.data.success) {
      // console.log('🔍 STEP 6 - Update successful!', {
      //   oldUserData: user,
      //   newUserData: {
      //     bio: res.data.user?.bio,
      //     profilePhoto: res.data.user?.profilePhoto,
      //     gender: res.data.user?.gender
      //   }
      // });
      
      const updatedUserData = {
        ...user,
        bio: res.data.user?.bio,
        profilePhoto: res.data.user?.profilePhoto,
        gender: res.data.user?.gender
      };
      
      dispatch(setAuthUser(updatedUserData));
      //console.log('🔍 STEP 7 - Dispatch completed, navigating to:', `/profile/${user?._id}`);
      
      navigate(`/profile/${user?._id}`);
      toast.success(res.data.message);
    } else {
    //  console.warn('🔍 STEP 6 - Response success false:', res.data);
     toast.error(
   "Something went wrong"
  );
    }
  } catch (error) {
    // 🔍 ERROR HANDLING: Detailed error logging
    // console.error('🔍 ERROR - Full error object:', error);
    // console.error('🔍 ERROR - Response:', error.response);
    // console.error('🔍 ERROR - Response data:', error.response?.data);
    // console.error('🔍 ERROR - Response status:', error.response?.status);
    // console.error('🔍 ERROR - Response headers:', error.response?.headers);
    // console.error('🔍 ERROR - Request config:', error.config);
    // console.error('🔍 ERROR - Message:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (error.response?.status === 401) {
      toast.error('Unauthorized. Please login again.');
    } else if (error.response?.status === 413) {
      toast.error('File too large. Maximum size is 5MB.');
    } else {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  } finally {
    setLoading(false);
    //console.log('🔍 STEP 8 - Loading state set to false');
  }
};

  return (
    <div className='flex max-w-2xl mx-auto pl-10 pr-10 text-zinc-50 bg-slate-600 shadow-md'>
      <section className='flex flex-col gap-6 w-full my-8'>
        <h1 className='font-bold text-xl'>Edit Profile</h1>
        <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <Avatar>
              {/* FIXED: Changed profilePicture to profilePhoto */}
              <AvatarImage src={user?.profilePhoto} alt="post_image" />
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-bold text-sm'>{user?.username}</h1>
              <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
            </div>
          </div>
          <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' />
          <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#318bc7]'>
            Change photo
          </Button>
        </div>
        <div>
          <h1 className='font-bold text-xl mb-2'>Bio</h1>
          <Textarea 
            value={input.bio} 
            onChange={(e) => setInput({ ...input, bio: e.target.value })} 
            name='bio' 
            className="focus-visible:ring-transparent" 
          />
        </div>
        <div>
          <h1 className='font-bold mb-2'>Gender</h1>
          <Select value={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex justify-end'>
          {loading ? (
            <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]' disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd]'>
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;