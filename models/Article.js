/* 
    This module contains:
        a variable referencing the mongoose Schema
        a constructor for a new ArticleSchema class
        a variable for export containing a mongoose method that creates a mongo model out of the Article Schema
*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    note: {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  });
  
  var Article = mongoose.model("Article", ArticleSchema);
  
  module.exports = Article;
  