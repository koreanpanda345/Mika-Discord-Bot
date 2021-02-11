const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cooldownSchema = Schema({
    userId: String,
    daily: Number,
    vote: Number
});

module.exports = mongoose.model("Cooldowns", cooldownSchema);