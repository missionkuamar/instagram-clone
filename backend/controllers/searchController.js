// controllers/searchController.js - Fixed
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import Hashtag from '../models/hashtagModel.js';

export const searchPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { caption: { $regex: search, $options: 'i' } },
                { 'author.username': { $regex: search, $options: 'i' } }
            ];
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // ✅ Populate author details
        const posts = await Post.find(query)
            .populate('author', 'username profilePicture name')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const total = await Post.countDocuments(query);

        console.log('Posts found:', posts.length);

        res.status(200).json({
            success: true,
            posts: posts, // ✅ Send as 'posts'
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1,
            }
        });

    } catch (error) {
        console.error('Search posts error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to search posts'
        });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username profilePicture name')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        console.log('Post found:', post._id);
        res.status(200).json({
            success: true,
            post: post // ✅ Send as 'post'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        let query = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const users = await User.find(query)
            .select('-password')
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        const total = await User.countDocuments(query);

        console.log('Users found:', users.length);

        res.status(200).json({
            success: true,
            users: users, // ✅ Send as 'users'
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(total / limitNum),
                totalItems: total,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1,
            }
        });
    } catch (error) {
        console.error('Search users error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to search users'
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        console.log('User found:', user._id);
        res.status(200).json({
            success: true,
            user: user, // ✅ Send as 'user'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
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

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const hashtags = await Hashtag.find({
            tag: { $regex: q, $options: 'i' }
        })
            .sort({ postsCount: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalItems = await Hashtag.countDocuments({
            tag: { $regex: q, $options: 'i' }
        });

        console.log('Hashtags found:', hashtags.length);

        return res.status(200).json({
            success: true,
            hashtags: hashtags, // ✅ Send as 'hashtags'
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalItems / limitNum),
                totalItems: totalItems,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(totalItems / limitNum),
                hasPrevPage: pageNum > 1,
            }
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

        // Likes filter - Fixed
        if (minLikes > 0) {
            searchQuery['likes'] = { $size: { $gte: minLikes } };
        }
        if (maxLikes) {
            searchQuery['likes'] = { $size: { $lte: maxLikes } };
        }
        if (minLikes > 0 && maxLikes) {
            searchQuery['likes'] = { $size: { $gte: minLikes, $lte: maxLikes } };
        }

        // Comments filter - Fixed
        if (minComments > 0) {
            searchQuery['comments'] = { $size: { $gte: minComments } };
        }
        if (maxComments) {
            searchQuery['comments'] = { $size: { $lte: maxComments } };
        }
        if (minComments > 0 && maxComments) {
            searchQuery['comments'] = { $size: { $gte: minComments, $lte: maxComments } };
        }

        // Sorting
        let sortOptions = {};
        switch (sortBy) {
            case 'recent':
                sortOptions = { createdAt: -1 };
                break;
            case 'popular':
                sortOptions = { 'likes': -1 };
                break;
            case 'mostCommented':
                sortOptions = { 'comments': -1 };
                break;
            default:
                sortOptions = { createdAt: -1 };
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const posts = await Post.find(searchQuery)
            .populate('author', 'username profilePicture name')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const totalItems = await Post.countDocuments(searchQuery);

        return res.status(200).json({
            success: true,
            posts: posts, // ✅ Send as 'posts'
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalItems / limitNum),
                totalItems: totalItems,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < Math.ceil(totalItems / limitNum),
                hasPrevPage: pageNum > 1,
            }
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

        // Get trending posts (most liked)
        const trendingPosts = await Post.find()
            .populate('author', 'username profilePicture name')
            .sort({ likes: -1 })
            .limit(10);

        // Format trending topics for frontend
        const trendingTopics = trendingHashtags.map(h => ({
            tag: h.tag,
            postsCount: h.postsCount || 0,
            posts: h.postsCount || 0
        }));

        return res.status(200).json({
            success: true,
            trendingTopics: trendingTopics, // ✅ Send as 'trendingTopics'
            trendingPosts: trendingPosts
        });
    } catch (error) {
        console.error('Get trending error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get trending topics'
        });
    }
};