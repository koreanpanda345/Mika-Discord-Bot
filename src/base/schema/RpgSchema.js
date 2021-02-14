const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rpgSchema = Schema({
	userId: String,
	lvl: Number,
	xp: Number,
	balance: Number
});

module.exports = mongoose.model("RpgProfile", rpgSchema);