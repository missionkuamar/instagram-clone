// routes/searchRoutes.js - Fixed
import express from 'express';
import { 
    searchPosts, 
    searchUsers, 
    searchHashtags, 
    advancedSearch, 
    getTrending, 
    getUserById, 
    getPostById 
} from '../controllers/searchController.js';
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// ✅ Use consistent naming
router.get('/search/posts', isAuthenticated, searchPosts);
router.get('/search/posts/:id', isAuthenticated, getPostById);
router.get('/search/users', isAuthenticated, searchUsers);
router.get('/search/users/:id', isAuthenticated, getUserById);
router.get('/search/hashtags', isAuthenticated, searchHashtags);
router.post('/search/advanced', isAuthenticated, advancedSearch);
router.get('/search/trending', isAuthenticated, getTrending);

export default router;