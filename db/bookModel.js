/**
 * Define bookSchema and bookModel
 */
const mongoose = require('./mongoose');

//  Define the Book schema
const bookSchema = new mongoose.Schema({
    
    // Implement bookSchema

});

const readingListSchema = new mongoose.Schema({
    
    // Implement readingListSchema
    
});

// Create the Book model
const Book = mongoose.model('Book', bookSchema);

// Create readingList model
const ReadingList = mongoose.model('ReadingList', readingListSchema);

module.exports = { ReadingList, Book };
