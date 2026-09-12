/**
 * RMIT University Vietnam
 * Course: COSC3060 Web Programming Studio
 * Semester: 2025B
 * Assessment: Fullstack in-class Lab Test
 * Author: Kai Nguyen
 * ID: s4126139
 * Acknowledgement: Bootstrap, Express, EJS, Mongoose, MongoDB Atlas, and Pexels.
 */

const path = require('path');
const express = require('express');
require('dotenv').config({ quiet: true });

const { Book, ReadingList } = require('./db/bookModel');
const { connectDatabase, mongoose } = require('./db/mongoose');

const SCHEDULE = [
  { category: 'TEXTBOOK', days: 'Monday-Wednesday' },
  { category: 'PHILOSOPHY', days: 'Thursday-Friday' },
  { category: 'NOVEL', days: 'Saturday-Sunday' },
];

function getPort(value = process.env.PORT) {
  const parsedPort = Number(value);
  return Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535
    ? parsedPort
    : 3000;
}

async function getRandomReadingList(ReadingListModel, currentListId) {
  const pipeline = [];

  if (currentListId && mongoose.Types.ObjectId.isValid(currentListId)) {
    pipeline.push({
      $match: { _id: { $ne: new mongoose.Types.ObjectId(currentListId) } },
    });
  }

  pipeline.push({ $sample: { size: 1 } });
  let [readingList] = await ReadingListModel.aggregate(pipeline);

  // A fallback keeps the page usable even if a database contains only one list.
  if (!readingList && pipeline.length > 1) {
    [readingList] = await ReadingListModel.aggregate([{ $sample: { size: 1 } }]);
  }

  return readingList || null;
}

function createApp({ BookModel = Book, ReadingListModel = ReadingList } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));

  async function renderReadingList(req, res) {
    const readingList = await getRandomReadingList(
      ReadingListModel,
      req.body?.currentListId,
    );

    if (!readingList) {
      return res.status(404).send('No reading lists are available. Run the seed script first.');
    }

    return res.render('list', {
      currentBook: null,
      pageTitle: 'Weekly Reading List',
      readingList,
      schedule: SCHEDULE,
    });
  }

  app.get('/', renderReadingList);
  app.post('/', renderReadingList);

  app.get('/book/:title', async (req, res) => {
    const book = await BookModel.findOne({ title: req.params.title });

    if (!book) {
      return res.status(404).send('Book not found.');
    }

    const relatedBooks = await BookModel.find({
      category: book.category,
      _id: { $ne: book._id },
    });

    return res.render('book', {
      book,
      currentBook: book,
      pageTitle: book.title,
      relatedBooks,
    });
  });

  app.use((req, res) => {
    res.status(404).send('Page not found.');
  });

  app.use((error, req, res, next) => {
    console.error(error.message);

    if (res.headersSent) {
      return next(error);
    }

    return res.status(500).send('Something went wrong. Please try again.');
  });

  return app;
}

const app = createApp();

if (require.main === module) {
  const port = getPort();

  connectDatabase()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server started and is running on: http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error(`Server could not start: ${error.message}`);
      process.exitCode = 1;
    });
}

module.exports = {
  SCHEDULE,
  app,
  createApp,
  getPort,
  getRandomReadingList,
};
