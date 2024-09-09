const mongoose = require("mongoose"); //does it matter ' vs "

const songSchema = new mongoose.Schema({
    artist: {type: String, required: true},
    songTitle: { type: String, required: true },
    genre: String,
    beatsPerMinute: Number,
}); // this is the schema

const Song = mongoose.model("Song", songSchema); // creates the model
module.exports = Song; // this exports the Song model so the rest of the app has access to it