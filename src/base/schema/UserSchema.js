const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userId: String,
    xp: Number,
    lvl: Number,
    balance: Number,
    username: String
})
userSchema.add({username: String});
module.exports = mongoose.model("User", userSchema);