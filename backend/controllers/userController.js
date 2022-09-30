import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';


//@desc Auth user & get token
//@route POST /api/users/login
//@access public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {

        res.status(200).json({
            _id: user._id,
            name: user.name,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401)
        throw new Error('Invalid email or password');
    }


})


//@desc get user profile details
//@route GET /api/users/profile
//@access private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404)
        throw new Error('User Not Found');
    }


})

//@desc Register a new user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email });

    if (userExists) {

        res.status(400)
        throw new Error('User already registered');
    } else {
        const user = await User.create({ name, email, password })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(400)
            throw new Error('Invalid User data');
        }
    }


})


//@desc update logged in user profile
//@route POST /api/users/profile
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password || user.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404)
        throw new Error('User Not Found');
    }


})

//@desc get all users
//@route GET /api/users
//@access private/admin
const users = asyncHandler(async (req, res) => {

    //pagination stuff
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1
    const count = await User.countDocuments({})

    const users = await User.find({}).limit(pageSize).skip(pageSize * (page - 1));;

    if (!users) {
        res.status(404)
        throw new Error('Empty users data!')
    } else {
        res.status(200).json({ users, page, pages: Math.ceil(count / pageSize) });
    }
})

//@desc delete a user
//@route DELETE /api/users/:id
//@access private/admin
const removeUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404)
        throw new Error('Empty users data!')
    } else {
        await user.remove();
        res.status(200).json({ message: "User Deleted Successfully!" });
    }
})

//@desc get user by id
//@route GET /api/users/:id
//@access private/admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        res.status(404)
        throw new Error('Empty users data!')
    } else {
        res.status(200).json(user);
    }
})

//@desc update any user by admin
//@route PUT /api/users/:id
//@access private/admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404)
        throw new Error('User Not Found');
    }


})

export {
    authUser, getUserProfile, registerUser,
    updateUserProfile, users, removeUser,
    getUserById, updateUser,
}