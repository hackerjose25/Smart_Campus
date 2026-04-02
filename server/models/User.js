const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    profilePicture: String,
    role: {
        type: String,
        default: "student"
    }
});

module.exports = mongoose.model("User", UserSchema);