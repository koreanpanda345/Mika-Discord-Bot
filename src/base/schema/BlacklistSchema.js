const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blacklistSchema = new Schema({
    userId: String,
    banned: Boolean
});

module.exports = mongoose.model("Blacklist", blacklistSchema);