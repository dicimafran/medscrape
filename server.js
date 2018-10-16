/* ===== Overview ========= 

    Dependencies
        middleware: express, bodyParser, logger
        scraper: axios and cheerio
        database: mongoose and db model

    GET Routes
         /scrape - gets scrapes from drugs.com
         /articles - gets all articles from db
         /articles:id - /articles/:id - gets article by id populated with its note
    
    POST Routes
        .articles/:id - saves/updates article's associated note

=======================*/

//  Dependencies, port, middleware setup, db connection 

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var axios = require('axios');
var cheerio = require('cheerio');
var request = require('request');
var mongoose = require('mongoose');
var db = require('./models');

// Express and port
var app = express();
var PORT = 3000;

// Middleware config
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// connection to mongoosedb. 
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true });

// ============ Scrape route =============

app.get('/scrape', function (req, res) {

    request("https://www.drugs.com/medical-news.html", function (error, response, dom) {
        var $ = cheerio.load(dom);
        var reg= /<.*?>/g

        const results = [];

        const newsScrape = {
            title: $('.newsItem').find('h2').toString().replace(reg, ',').split(',,,'),
            content: $('.newsItem').find('p.newsContent').toString().replace(reg, ',').split(',,'),
            url: $('.newsItem').find('a').attr('href')
        }

        results.push(newsScrape)
        console.log(results)

        
        // Create a new Article using the `result` object built from scraping
        db.Article.create(results)
            .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                return res.json(err);
            });
        
        res.send("Scrape Complete");
    });

});

// ========== Get /articles  =============

app.get('/articles', function (req, res) {
    db.Article.find({})

        .then(function (dbArticle) {
            res.json(dbArticle);
        })

        .catch(function (err) {
            res.json(err);
        });
});

// ========== Get /articles/:id =============

app.post('articles/:id', function (req, res) {

    db.Article.findOne({ _id: req.params.id })
        .populate('note')

        .then(function (dbArticle) {
            res.json(dbArticle);
        })

        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});

// Starts the server
app.listen(PORT, function () {
    console.log('App running on port ' + PORT + '.')
});

/* ================= Notes ===============
    
    Middleware config: 
        - morgan logger to log requests
        - body parser for form submissions
        - serves public folder as static directory
    
    Connection to mongoosedb
        - useNewUrlParser is for avoiding deprecation warning for npm mongodb driver
        - localhost:27017 is the default port of mongo

    Routes Overview: 
        GET: 
            /scrape 
            /articles:id - gets all articles from db
            /articles/:id - gets article by id populated with its note
            
        POST:
            /articles:id - saves/updates article's associated note
*/