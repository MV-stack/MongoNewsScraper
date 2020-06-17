var db = require ("../models")
var axios = require("axios");
var cheerio = require("cheerio");
function apiroutes(app){ 
  // A GET route for scraping 
app.get("/scrape", function(req, res) {
    // Grab the body of the html with axios
    axios.get("https://apnews.com").then(function(response) {
      // Load body into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Grab every h1 within an article tag, and do the following:
      $("div.FeedCard").each(function(i, element) {
        //Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("div.CardHeadline")
          .children("a")
          .children("h1")
          .text();
        result.link = $(this)
        .children("div.CardHeadline")
          .children("a")
          .attr("href");
          result.summary = $(this)
          .children("a")
          .children("div.content")
          .children("p")
          .text()
          console.log(result)
        //  https://storage.googleapis.com/afs-prod/media/03c8f4a13e37403992d670c34290530b/800.jpeg
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            //console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  app.put("/api/articles/:id",function(req, res){
    db.Article.update({_id:req.params.id},{
      saved:true
    }).then(function(results){
      res.json(results)
    })
  })
  app.get("/saved",function(req, res){
    db.Article.find({saved:true}).then(function(dbArticle){
      var newArticles = dbArticle.map(article =>{
        return {
          _id:article._id,
          title:article.title,
          summary:article.summary,
          link:article.link
        }
      })

      res.render("saved",{articles:newArticles})
    }).catch(function(err){
      res.json(err)
    })
  })
  // Route for getting all Articles from the db
  app.get("/", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({saved:false}).then(function(dbArticle){
      var newArticles = dbArticle.map(article =>{
        return {
          _id:article._id,
          title:article.title,
          summary:article.summary,
          link:article.link
        }
      })

      res.render("index",{articles:newArticles})
    }).catch(function(err){
      res.json(err)
    })
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // TODO
   db.Article.findOne({}).populate("note").then(function(dbArticle){
     res.json(dbArticle)
   }).catch(function(err){
     res.json(err)
   })
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // TODO
    db.Article.create(req.body)
    .then(function(dbArticle) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.User.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbArticle) {
      // If the User was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
  });
  
}

module.exports = apiroutes