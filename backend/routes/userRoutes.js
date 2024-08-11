const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userController");
const { body } = require("express-validator");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",
    body("email", "Invalid Email").isEmail(),
    body("password", "Password Too Short").isLength({ min: 5 }),
    registerUser)

router.get("/",protect,allUsers)

router.post("/login",
    body("email", "Invalid Email").isEmail(),
    body("password", "Password Too Short").isLength({ min: 5 }),
    authUser)



module.exports = router;