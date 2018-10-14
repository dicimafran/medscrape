/*
    In this module, we're using the mongoose schema.
    We are creating a new Class called NoteSchema.
    Using the new NoteSchema object, we create a new model and pass it into the mongoose model method.
*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
