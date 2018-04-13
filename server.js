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

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/Headlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});


// Routes

// A GET route for scraping the Vice News website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article.story.theme-summary").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("h2.story-heading").children("a").text();
      result.link = $(this).children("h2.story-heading").children("a").attr("href"); 
      result.summary = $(this).children("p.summary").text();

      // Create a new Headline using the `result` object built from scraping
      db.Headline.create(result)
        .then(function(dbHeadline) {
          // View the added result in the console
          console.log(dbHeadline);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Headline, send a message to the client
    res.send("Scrape Complete hit return to view your new articles!");
  });
});

// Route for getting all headlines from the db
app.get("/headlines", function(req, res) {
  // TODO: Finish the route so it grabs all of the headlines
  db.Headline.find({})
  .populate("note")
  .then(function(dbHeadline) {
    res.json(dbHeadline);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for grabbing a specific Headline by id, populate it with it's note
app.get("/headlines/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one headline using the req.params.id,
  // and run the populate method with "note",
  // then responds with the headline with the note included
  db.Headline.findOne({_id: req.params.id})
  .populate("note")
  .then(function(dbHeadline) {
    res.json(dbHeadline);
  })
  .catch(function(err) {
    res.json(err);
  });
});

// Route for saving/updating an Headline's associated Note
app.post("/headlines/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an headline from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Headline.findOneAndUpdate({_id: req.params.id}, {$set: {note: dbNote._id}});
    })
    .then(function(dbHeadline) {
      res.json(dbHeadline);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
