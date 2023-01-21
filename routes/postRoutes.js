const express = require('express')
const router = express.Router()

const { 
    createPost,
    deleteNode,
    postAddCategory,
    getPostsByCategory,
    getPostInfo,

    getRecommendedPostsByCategories,
    getRecommendedPostsByFollowings,
    getRecommendedPostsByLikedPosts,
    getRecommendedPostsByUserPosts,

    searchPosts

} = require('../controllers/postController')

router.post('/posts', createPost)
router.delete('/posts', deleteNode)
router.post('/posts/categories', postAddCategory)
router.get('/posts', getPostsByCategory)
router.get('/posts/info', getPostInfo)
// Recommendation
router.get('/posts/recommendation/categories', getRecommendedPostsByCategories)
router.get('/posts/recommendation/followings', getRecommendedPostsByFollowings)
router.get('/posts/recommendation/likedposts', getRecommendedPostsByLikedPosts)
router.get('/posts/recommendation/userposts', getRecommendedPostsByUserPosts)
// Search
router.get('/posts/search', searchPosts)


module.exports = router