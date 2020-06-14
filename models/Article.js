var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Create a new UserSchema object
var ArticleSchema = new Schema({  
  title: {
    type: String,
    required: true
  },  
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String, 
    required: true
  }, 
  saved: {
    type: Boolean,
    default: false
  },
  // `note` is an object that stores a Note id, the ref property links the ObjectId to the Note model
  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
