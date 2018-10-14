// Note: Overview of Contents at bottom

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var logger = require('morgan');
var bodyParser = require('body-parser');

// Express and port
var app = express();
var PORT = 3000;

// Middleware config
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// connection to mongoosedb. 
mongoose.connect('mongodb//localhost:27017', { useNewUrlParser: true });

/* ========== Scrape route =============
    
    variables
        newsScrape- for scrape
        result- empty object followed by key-value pair assignments from newsScrape object

    methods
        creating new article based on result object
        catch error
        response send to indicate scrape is complete

============= */

app.get('/scrape', function (req, res) {

    axios.get('https://www.drugs.com/medical-news.html').then(function (res) {
        
        const newsScrape = {
            title: $('.newsItem').find('h2').toString().replace(reg, ',').split(',,,'),
            content: $('.newsItem').find('p.newsContent').toString().replace(reg, ',').split(',,'),
            url: $('.newsItem').find('a').attr('href')
        }

        console.log(newsScrape);

        var result= {};
        result.title = newsScrape.title
        result.content= newsScrape.content

        db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle)
            })
            .catch(function(err) {
                return res.json(err);
            });
        res.send('Scrape Complete');
    });
});

/* ========== Get /articles/:id =============
        gets all articles from db
============================================ */

app.get('/articles/:id', function (req, res) {
    db.Article.find({})

    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    
    .catch(function(err) {
      res.json(err);
    });
});

/* ========== Get /articles/:id =============
       Grabs specific Article by id, populates it with it's note
============================================ */
app.post('articles/:id', function (req, res) {

    db.Article.findOne({ _id: req.params.id })
    .populate("note")

    .then(function(dbArticle) {
      res.json(dbArticle);
    })

    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});

// Starts the server
app.listen(PORT, function () {
    console.log('App running on port ' + PORT + '.')
});



/* ================= Table of Contents ===============
    Dependencies
    Express and port
    Middleware config: 
        - morgan logger to log requests
        - body parser for form submissions
        - serves public folder as static directory
    
    Connection to mongoosedb
        - useNewUrlParser is for avoiding deprecation warning for npm mongodb driver
        - localhost:27017 is the default port of mongo

    Routes Overview: 
        GET: 
            /scrape - gets scrapes from drugs.com
            /articles:id - gets all articles from db
            /articles/:id - gets article by id populated with its note
            
        POST:
            /articles:id - saves/updates article's associated note
*/