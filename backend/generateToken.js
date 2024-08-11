const jwt  = require("jsonwebtoken")

const generateToken = (id)=>{
    return jwt.sign({id},process.env.jwtSecret,{
        expiresIn:"15d"
    })
};

module.exports = generateToken;