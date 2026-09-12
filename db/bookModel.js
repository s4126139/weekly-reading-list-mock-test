/**
 * Mongoose models used by the Weekly Reading List application.
 */
const { mongoose } = require('./mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['TEXTBOOK', 'PHILOSOPHY', 'NOVEL']
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
});

const readingListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  books: {
    type: [bookSchema],
    required: true,
    validate: {
      validator(books) {
        const categories = books.map((book) => book.category);

        return books.length === 3 && new Set(categories).size === 3;
      },
      message: 'A reading list must contain one book from each category.'
    }
  }
});

const Book = mongoose.model('Book', bookSchema);
const ReadingList = mongoose.model('ReadingList', readingListSchema);

module.exports = {
  Book,
  ReadingList,
  bookSchema,
  readingListSchema
};
