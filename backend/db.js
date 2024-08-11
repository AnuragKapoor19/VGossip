const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const URI = process.env.URI;

const mongodb = async () => {
    await mongoose.connect(URI).then(() => {
        console.log('Database Connected')
    }).catch((error) => {
        console.log("Error while connecting database: ", error.message)
    })
}

module.exports = mongodb;