import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Post from './Post'
import useGetAllPost from '../hooks/useGetAllPosts'
const Posts = () => {
  // const [posts, setPosts] = useState([1, 2, 3, 4, 5, 6, 7]);
  
  // You can fetch real posts from API here
  // useEffect(() => {
  //   fetchPosts();
  // }, []);
 useGetAllPost();
  const { posts } = useSelector(store => store.post);
  //console.log('📌 [Posts Component] Posts from Redux Store:', posts);
  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  )
}

export default Posts