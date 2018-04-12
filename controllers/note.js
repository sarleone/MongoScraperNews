var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var nRouter = express.nRouter();
// Require all models
var db = require("./models");

// // Initialize Express
// var app = express();
// get route -> index
nRouter.get("/", function(req, res) {
    // send us to the next get function instead.
    res.redirect("/scrape");
});

// Route for grabbing a specific Headline by id, populate it with it's note
nRouter.get("/headlines/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Headline.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbHeadline) {
        // If we were able to successfully find an Headline with the given id, send it back to the client
        //res.json(dbHeadline);
        res.render(dbHeadline);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});
  
// Route for saving/updating an Headline's associated Note
app.post("/headlines/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Headline with an `_id` equal to `req.params.id`. Update the Headline to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbHeadline) {
        // If we were able to successfully update an Headline, send it back to the client
        res.json(dbHeadline);
        res.redirect("/");
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

  
module.exports = nRouter;