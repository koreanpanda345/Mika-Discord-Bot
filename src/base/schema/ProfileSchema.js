const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = Schema({
    userId: String,
    background: String,
    account: {type: Schema.Types.ObjectId, ref: "users"},
    own_bg: [{type: Schema.Types.ObjectId, ref: "backgrounds"}],
    votes: Number,
    married: String,
    birthday: String,
    description: String
});
profileSchema.add({birthday: String, description: String});
module.exports = mongoose.model("Profile", profileSchema);