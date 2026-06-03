import React from 'react'
import Feed from './Feed'
import useGetSuggestedUser from '@/hooks/useGetSuggestedUser';
const Home = () => {
 useGetSuggestedUser();
  return (
    <div className="space-y-6">
      <Feed />
    </div>
  )
}

export default Home