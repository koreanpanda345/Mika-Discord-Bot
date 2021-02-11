const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const afkSchema = Schema({
    userId: String,
    reason: String,
    pings: [{author: String, content: String, time: String}]
});

module.exports = mongoose.model("Afk", afkSchema);