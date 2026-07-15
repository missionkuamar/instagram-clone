// routes/searchRoutes.js
import express from 'express';
import { searchPosts, searchUsers, searchHashtags, advancedSearch, getTrending } from '../controllers/searchController.js';
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get('/search', isAuthenticated, searchPosts);
router.get('/search/users', isAuthenticated, searchUsers);
router.get('/search/hashtags', isAuthenticated, searchHashtags);
router.post('/search/advanced', isAuthenticated, advancedSearch);
router.get('/search/trending', isAuthenticated, getTrending);

export default router;