// controllers/searchController.js
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import Hashtag from '../models/hashtagModel.js';

export const searchPosts = async (req, res) => {
    try {
        const { q, filter = 'all', page = 1, limit = 10 } = req.query;
        console.log("search query calling")
        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        let query = {};

        // Build search query
        if (filter === 'all' || filter === 'posts') {
            query = {
                $or: [
                    { caption: { $regex: q, $options: 'i' } },
                    { 'author.username': { $regex: q, $options: 'i' } }
                ]
            };
        }

        const posts = await Post.find(query)
            .populate('author', 'username profilePicture')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalItems = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalItems / parseInt(limit));

        return res.status(200).json({
            success: true,
            posts,
            currentPage: parseInt(page),
            totalPages,
            totalItems,
            itemsPerPage: parseInt(limit)
        });
    } catch (error) {
        console.error('Search posts error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to search posts'
        });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        
        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const users = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        })
        .select('-password')
        .skip(skip)
        .limit(parseInt(limit));

        const totalItems = await User.countDocuments({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        });

        return res.status(200).json({
            success: true,
            users,
            totalItems,
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Search users error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to search users'
        });
    }
};

export const searchHashtags = async (req, res) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        
        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const hashtags = await Hashtag.find({
            tag: { $regex: q, $options: 'i' }
        })
        .sort({ postsCount: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));

        const totalItems = await Hashtag.countDocuments({
            tag: { $regex: q, $options: 'i' }
        });

        return res.status(200).json({
            success: true,
            hashtags,
            totalItems,
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Search hashtags error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to search hashtags'
        });
    }
};

export const advancedSearch = async (req, res) => {
    try {
        const {
            query,
            startDate,
            endDate,
            minLikes = 0,
            maxLikes,
            minComments = 0,
            maxComments,
            sortBy = 'recent',
            page = 1,
            limit = 10
        } = req.body;

        let searchQuery = {};

        // Text search
        if (query && query.trim()) {
            searchQuery.caption = { $regex: query, $options: 'i' };
        }

        // Date range
        if (startDate || endDate) {
            searchQuery.createdAt = {};
            if (startDate) searchQuery.createdAt.$gte = new Date(startDate);
            if (endDate) searchQuery.createdAt.$lte = new Date(endDate);
        }

        // Likes filter
        if (minLikes > 0 || maxLikes) {
            searchQuery['likes._id'] = {};
            if (minLikes > 0) searchQuery['likes._id'].$gte = minLikes;
            if (maxLikes) searchQuery['likes._id'].$lte = maxLikes;
        }

        // Comments filter
        if (minComments > 0 || maxComments) {
            searchQuery['comments._id'] = {};
            if (minComments > 0) searchQuery['comments._id'].$gte = minComments;
            if (maxComments) searchQuery['comments._id'].$lte = maxComments;
        }

        // Sorting
        let sortOptions = {};
        switch (sortBy) {
            case 'recent':
                sortOptions = { createdAt: -1 };
                break;
            case 'popular':
                sortOptions = { 'likes.length': -1 };
                break;
            case 'mostCommented':
                sortOptions = { 'comments.length': -1 };
                break;
            default:
                sortOptions = { createdAt: -1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const posts = await Post.find(searchQuery)
            .populate('author', 'username profilePicture')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const totalItems = await Post.countDocuments(searchQuery);

        return res.status(200).json({
            success: true,
            results: posts,
            totalItems,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalItems / parseInt(limit)),
            itemsPerPage: parseInt(limit)
        });
    } catch (error) {
        console.error('Advanced search error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to perform advanced search'
        });
    }
};

export const getTrending = async (req, res) => {
    try {
        // Get trending hashtags
        const trendingHashtags = await Hashtag.find()
            .sort({ postsCount: -1 })
            .limit(10);

        // Get trending posts (most liked in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trendingPosts = await Post.find({
            createdAt: { $gte: sevenDaysAgo }
        })
        .populate('author', 'username profilePicture')
        .sort({ 'likes.length': -1 })
        .limit(10);

        return res.status(200).json({
            success: true,
            trendingHashtags,
            trendingPosts
        });
    } catch (error) {
        console.error('Get trending error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get trending topics'
        });
    }
};