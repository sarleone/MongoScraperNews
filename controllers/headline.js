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
var hRouter = express.hRouter()
var db = require("./models");

// // Initialize Express
// var nRouter = express();

// get route -> index
router.get("/", function(req, res) {
    res.redirect("/burgers");
  });

// A GET route for scraping the NYT website
nRouter.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.nytimes.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an Headline tag, and do the following:
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
      res.send("Scrape Complete");
    });
});
  
// Route for getting all Headlines from the db
nRouter.get("/headlines", function(req, res) {
    // Grab every document in the Headlines collection
    db.Headline.find({})
      .then(function(dbHeadline) {
        // If we were able to successfully find Headlines, send them back to the client
        res.json(dbHeadline);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});

// put route -> back to index
nRouter.put("/scrape/:id", function(req, res) {
    dbHeadline.update({ _id: req.params.id }, function(result) {
      // wrapper for orm.js that using MySQL update callback will return a log to console,
      // render back to index with handle
      console.log(result);
      // Send back response and let page reload from .then in Ajax
      res.sendStatus(200);
    });
});
  
module.exports = hRouter;