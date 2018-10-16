/* 
    This module contains:
         a constructor for a new NoteSchema class
         a variable for export containing a mongoose method that creates a mongo model out of the Note Schema
*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;

