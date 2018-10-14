/* 
    In this module, we are creating an ArticleSchema class constructor
    From the schema constructor, we are creating a new var for export
    Taking the mongoose model method, we create a new model based on the schema
    var Article is being exported, 
*/

var mongoose= require ('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        String,
        require: true
    },
    link:{
        type: String,
        require: true
    },
    note: {
        type:Schema.Types.ObjectId,
        ref: 'Note'
    }
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;