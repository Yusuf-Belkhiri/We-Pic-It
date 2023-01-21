const express = require('express')
const router = express.Router()

const { 
    createUser, 
    createAdmin,
    signIn,
    getUserInfoById,
    getUserProfileInfo,
    getUserPosts,
    deleteNode,
    userFollowUser,
    userPostRelation,
    userAddCategory,
    userUnfollowUser,
    userPostRemoveRelation,
    userRemoveCategory,
    editUserInfo,
} = require('../controllers/userControllers')

router.post('/users', createUser)
router.post('/users/admins', createAdmin)
router.get('/users', signIn)
router.get('/users/userinfo', getUserInfoById)
router.get('/users/userprofileinfo', getUserProfileInfo)
router.get('/users/userposts', getUserPosts)
router.delete('/users', deleteNode)
router.post('/users/follow', userFollowUser)
router.post('/users/post', userPostRelation)
router.post('/users/categories', userAddCategory)
router.post('/users/unfollow', userUnfollowUser)
router.delete('/users/userpostrelation', userPostRemoveRelation)
router.delete('/users/categories', userRemoveCategory)
router.post('/users/editinfo', editUserInfo)


module.exports = router