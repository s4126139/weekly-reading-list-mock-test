/**
 * RMIT University Vietnam
 * Course: COSC3060 | COSC3061 Web Programming Studio
 * Semester: 2026B
 * Assessment: Full-Stack In-Class Lab Test
 * Author: Kai Nguyen
 * ID: s4126139
 * Acknowledgement: Mongoose and MongoDB Atlas documentation.
 */

const { mongoose } = require('./mongoose');

// A book stores all content needed by the list and detail pages.
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['TEXTBOOK', 'PHILOSOPHY', 'NOVEL'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

// ReadingList embeds three books because each generated list is a fixed snapshot.
const readingListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  books: {
    type: [bookSchema],
    required: true,
    validate: {
      // Require exactly one book from each of the three allowed categories.
      validator(books) {
        const categories = books.map((book) => book.category);
        return books.length === 3 && new Set(categories).size === 3;
      },
      message: 'A reading list must contain one book from each category.',
    },
  },
});

const Book = mongoose.model('Book', bookSchema);
const ReadingList = mongoose.model('ReadingList', readingListSchema);

module.exports = {
  Book,
  ReadingList,
  bookSchema,
  readingListSchema,
};
