import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user } = useSelector(store => store.auth || {});

  useGetUserProfile(userId);

  const isFollowing = user?.following?.includes(userProfile?._id);
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='bg-white text-gray-500 rounded-md shadow-md'>
      <div className="p-4">
        {/* Profile Header */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <section className='flex justify-center'>
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} alt='profileImage' />
              <AvatarFallback>{userProfile?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </section>

          <section className='space-y-3'>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-lg">{userProfile?.username}</span>
              {isLoggedInUserProfile ? (
                <div className="flex flex-wrap gap-2">
                  <Link to="/account/edit">
                    <Button variant='secondary' className='h-8 bg-gray-200 hover:bg-gray-300 text-gray-700'>
                      Edit Profile
                    </Button>
                  </Link>
                  <Button variant='secondary' className='h-8 bg-gray-200 hover:bg-gray-300 text-gray-700'>
                    View Analytics
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button className="bg-[#0095F6] hover:bg-[#318bc7] text-white h-8">
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                  <Button variant='secondary' className="h-8">
                    Message
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex gap-6">
              <p><span className='font-semibold'>{userProfile?.posts?.length || 0}</span> posts</p>
              <p><span className='font-semibold'>{userProfile?.followers?.length || 0}</span> followers</p>
              <p><span className='font-semibold'>{userProfile?.following?.length || 0}</span> following</p>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-semibold">{userProfile?.bio || 'No bio yet'}</span>
              <Badge className="w-fit" variant='secondary'>
                <AtSign className="h-3 w-3" />
                <span className='pl-1'>{userProfile?.username}</span>
              </Badge>
            </div>
          </section>
        </div>

        {/* Tabs */}
        <div className='border-t border-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span 
              className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold border-t-2 border-black text-black' : 'text-gray-500'}`} 
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </span>
            <span 
              className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold border-t-2 border-black text-black' : 'text-gray-500'}`} 
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </span>
          </div>
          
          {/* Posts Grid */}
          <div className='grid grid-cols-3 gap-1 mt-4'>
            {displayedPost?.length > 0 ? (
              displayedPost.map((post) => (
                <div key={post?._id} className='relative group cursor-pointer'>
                  <img 
                    src={post?.image} 
                    alt='post' 
                    className='rounded-sm w-full aspect-square object-cover' 
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex items-center text-white space-x-4'>
                      <div className='flex items-center gap-2'>
                        <Heart className="h-5 w-5" />
                        <span>{post?.likes?.length || 0}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <MessageCircle className="h-5 w-5" />
                        <span>{post?.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                No {activeTab} to display
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;