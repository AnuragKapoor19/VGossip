const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../generateToken");
const { validationResult } = require("express-validator")

const registerUser = asyncHandler(async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, pic, gender } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        gender,
        pic
    })

    if (user) {
        res.status(201).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({ success: false });
        throw new Error("Failed to create the User")
    }
})

const authUser = asyncHandler(async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && await (user.matchPassword(password))) {
        res.json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({ success: false });
        throw new Error("Invalid Email or Password")
    }
})

// /api/users?search=piyush
const allUsers = async (req, res) => {
    const keyword = await req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
}


module.exports = { authUser, registerUser, allUsers };
// module.exports = registerUser;