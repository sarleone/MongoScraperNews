var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware
// // Use morgan logger for logging requests
// app.use(logger("dev"));
// // Use body-parser for handling form submissions
// app.use(bodyParser.urlencoded({ extended: true }));
// // Use express.static to serve the public folder as a static directory
// app.use(express.static("views"));
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

var routes = require("./controllers");

app.use(routes);
app.use("/update", routes);
app.use("/create", routes);

// Use express.static to serve the public folder as a static directory
app.use(express.static("views"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/Headlines");
//If deployed, use the deployed database. Otherwise use the local Headlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Headlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
}).then(function() {
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
});

console.log(module.exports);
//mongoose.connect("mongodb://localhost/Headlines");

// Routes

// // Route for grabbing a specific Headline by id, populate it with it's note
// app.get("/headlines/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Headline.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbHeadline) {
//       // If we were able to successfully find an Headline with the given id, send it back to the client
//       res.json(dbHeadline);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Headline's associated Note
// app.post("/headlines/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Headline with an `_id` equal to `req.params.id`. Update the Headline to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbHeadline) {
//       // If we were able to successfully update an Headline, send it back to the client
//       res.json(dbHeadline);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

