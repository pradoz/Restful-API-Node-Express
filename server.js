// server.js

/* Setup */
// Declare packages required
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');


// Connect MongoDB
mongoose.connect('mongodb://localhost:27017');

// Define app to be an express object
var app = express();

// Configure app to use body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure port
var port = process.env.PORT || 8080;

/* API Routes */

// Note:
// The order we define parts of our router is important.

// Configure the router
var router = express.Router();

// Middleware to execute upon all requests
router.use(function(req, res, next) {
    console.log("requests are happening");
    // Advance to the next routes
    next();
})

// Test route
router.get('/', function(req, res) {
    res.json({ message: "the API is working!"});
});

/* Bear-related API routes */
// ----------------------------------------------
router.route('/bears')

    // Create a Bear
    // Accessed with the following HTTP Request:
    // POST http://localhost:8080/api/bears
    .post(function(req, res) {

        // Create a new bear and save its name from the request
        var bear = new Bear();
        bear.name = req.body.name;

        // Save the bear and check for errors
        bear.save(function(err) {
            if (err) { res.send(err); }

            // .json output to verify a bear was created
            res.json({ message: "Bear created!" });
        });
    }) // end of POST

    // Get all of the Bears
    // Accessed with the following HTTP Request:
    // GET http://localhost:8080/api/bears
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err) { res.send(err); }

            // Return all of the bears in .json format
            res.json(bears);
        });
    }); // end of GET
// End of HTTP Requests for this route

// ----------------------------------------------

router.route('/bears/:bear_id')
    // Get an individual Bear by its bear_id
    // Accessed with the following HTTP Request:
    // GET http://localhost:8080/api/bears/:bear_id
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) { res.send(err); }

            // Return the Bear
            res.json(bear);
        }); // end of GET
    })

    // Update the name of a Bear
    // Accessed with the following HTTP Request:
    // PUT http://localhost:8080/api/bears/:bear_id
    .put(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) { res.send(err); }

            // Update the Bear's name
            bear.name = req.body.name;
            console.log("bear.name:" + bear.name);
            console.log("req.body.name:" + req.body.name);

            // Save the bear
            bear.save(function(err) {
                if (err) { res.send(err); }
                res.json({ message: "Changed bear named" });
            });
        }); // end of PUT
    })

    // Deletes a Bear from the database
    // Accessed with the following HTTP Request:
    // DELETE http://localhost:8080/api/bears/:bear_id
    .delete(function(req, res) { 
        Bear.remove({ _id: req.params.bear_id },
            function(err, bear) {
                if (err) { res.send(err); }
                res.json({ message: "A bear was deleted." });
            }); // End of DELETE
     });
// End of HTTP Requests for this route

// ----------------------------------------------

// Register all of the API routes
app.use('/api', router);

// Start the server
app.listen(port);
console.log("Magic happens on port " + 8080);



















