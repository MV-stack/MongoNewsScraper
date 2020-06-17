var express = require("express"); 
var logger = require("morgan"); 
var mongoose = require("mongoose");
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
 

var db = require("./models");

var PORT = process.env.PORT || 3000;
var app = express(); 

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var apiroutes = require ("./routes/apiroutes"); 
apiroutes(app);
// Connect to the Mongo DB
mongoose.connect( process.env.MONGODB_URI ||"mongodb://localhost/apnews", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
