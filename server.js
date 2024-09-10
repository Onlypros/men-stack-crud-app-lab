const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
// Here is where we import modules
// We begin by loading Express
const express = require("express");
const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override"); // tricks the system and enable PUT and DELETE
const morgan = require("morgan"); // tricks the system and enable PUT and DELETE
const path = require("path");
const app = express();
// middleware-------------------------------------------------
// DB connection code
app.use(express.urlencoded({ extended: false })); // this enables the route to handle submissions for creating new items in the DB
app.use(methodOverride("_method")); // see above
app.use(morgan("dev")); // see above
app.use(express.static(path.join(__dirname, "public")));
//---------------------------------
// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });
const Song = require("./models/song.js");
// Routes----------------------------------------------
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

app.get("/songs", async (req, res) => {
    const allSongs = await Song.find();
    // console.log(allSongs); // log the songs
    res.render("songs/index.ejs", {songs: allSongs});
}); // this route defines the index page

app.get("/songs/new", (req, res) => {
    res.render("songs/new.ejs");
}); // This route sends the user a form page!

app.get("/songs/:songId", async (req, res) => {
    const foundSong = await Song.findById(req.params.songId);
    res.render("songs/show.ejs", { song: foundSong});
}); // defines the show route for songs

app.get("/songs/:songId/edit", async (req, res) => {
    const foundSong = await Song.findById(req.params.songId);
    res.render("songs/edit.ejs" , {
        song: foundSong,
    });
}); // defines the delete route for songs

app.post("/songs", async (req, res) => {
    await Song.create(req.body);
    console.log(req.body); // this should collect the form data
    res.redirect("/songs");
});

app.delete("/songs/:songId", async (req, res) => {
    await Song.findByIdAndDelete(req.params.songId);
    res.redirect("/songs");
}); // adds the delete functionality

app.put("/songs/:songId", async (req, res) => {
    // update the song in the database
    await Song.findByIdAndUpdate(req.params.songId, req.body);
    // redirect to the songs show page to see the updates
    res.redirect(`/songs/${req.params.songId}`);
});

// app.prependOnceListener("/songs", (req, res) => {
//     Song.create(req.body);
//     res.redirect("/songs/new");
// })

//----------------------------------------------------
app.listen(3000, () => {
  console.log("Listening on port 3000");
});