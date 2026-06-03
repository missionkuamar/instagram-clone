import { createSlice } from "@reduxjs/toolkit"


const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
    },
    reducers: {
        setPosts:(state, action) => {
            state.posts = action.payload;
            console.log('📌 [SLICE] Posts updated:', state.posts);
        },
        deletePost: (state, action) => {
      // ✅ Delete ke liye alag reducer
      state.posts = state.posts.filter(p => p._id !== action.payload);
    },
    //   updatePostLike: (state, action) => {
    //         const { postId, likeCount, isLiked } = action.payload;
    //         const post = state.posts.find(p => p._id === postId);
    //         if (post) {
    //             // Update likes count
    //             if (likeCount !== undefined) {
    //                 // If we have exact count from backend
    //                 post.likes = likeCount; // Or create new field
    //             } else {
    //                 // Manual update
    //                 if (isLiked) {
    //                     post.likes = [...(post.likes || []), 'temp']; // Add
    //                 } else {
    //                     post.likes = (post.likes || []).filter(id => id !== 'temp'); // Remove
    //                 }
    //             }
    //         }
    //     },
setSelectedPost: (state, action) => {
  state.selectedPost = action.payload;
},
  // ✅ Add this reducer for comments
        updatePostComments: (state, action) => {
            const { postId, comments } = action.payload;
            const post = state.posts.find(p => p._id === postId);
            if (post) {
                post.comments = comments;
            }
            if (state.selectedPost?._id === postId) {
                state.selectedPost.comments = comments;
            }
        },
    }
});

export const { setPosts, deletePost, updatePostLike, setSelectedPost, updatePostComments } = postSlice.actions;

export default postSlice.reducer;