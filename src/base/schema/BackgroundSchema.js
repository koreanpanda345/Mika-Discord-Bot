const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const backgroundSchema = Schema({
    id: Number,
    name: String,
    url: String,
    price: Number,
    dev: Boolean,
    staff: Boolean,
    nitro: Boolean
});

module.exports = mongoose.model("Backgrounds", backgroundSchema);