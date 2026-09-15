/**
 * RMIT University Vietnam
 * Course: COSC3060 | COSC3061 Web Programming Studio
 * Semester: 2026B
 * Assessment: Full-Stack In-Class Lab Test
 * Author: Kai Nguyen
 * ID: s4126139
 * Acknowledgement: Bootstrap, Express, EJS, Mongoose, MongoDB Atlas, and Pexels.
 */

const path = require('path');
const express = require('express');
require('dotenv').config({ quiet: true });

const { Book, ReadingList } = require('./db/bookModel');
const { connectDatabase, mongoose } = require('./db/mongoose');

const app = express();
const SCHEDULE = [
  { category: 'TEXTBOOK', days: 'Monday-Wednesday' },
  { category: 'PHILOSOPHY', days: 'Thursday-Friday' },
  { category: 'NOVEL', days: 'Saturday-Sunday' },
];

// Configure EJS, form data parsing, and the public static-assets folder.
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/** Return a valid port number, or port 3000 when PORT is missing/invalid. */
function getPort(value) {
  const parsedPort = Number(value);
  return Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535
    ? parsedPort
    : 3000;
}

/**
 * Select one random list. When a current ID is supplied, Atlas first excludes
 * it so that Refresh normally displays a different reading list.
 */
async function getRandomReadingList(currentListId) {
  const pipeline = [];

  if (currentListId && mongoose.Types.ObjectId.isValid(currentListId)) {
    pipeline.push({
      $match: { _id: { $ne: new mongoose.Types.ObjectId(currentListId) } },
    });
  }

  pipeline.push({ $sample: { size: 1 } });
  let [readingList] = await ReadingList.aggregate(pipeline);

  // Fall back to the only list when the database contains just one list.
  if (!readingList && pipeline.length > 1) {
    [readingList] = await ReadingList.aggregate([{ $sample: { size: 1 } }]);
  }

  return readingList || null;
}

/** Prepare presentation-ready data so EJS does not contain lookup logic. */
function buildWeeklyReadings(readingList) {
  return SCHEDULE.map(({ category, days }) => ({
    days,
    book: readingList.books.find((book) => book.category === category),
  })).filter(({ book }) => book);
}

/** Load and render the shared reading-list page for GET and POST. */
async function renderReadingList(req, res) {
  const readingList = await getRandomReadingList(req.body?.currentListId);

  if (!readingList) {
    return res.status(404).send('No reading lists are available. Run the seed script first.');
  }

  return res.render('list', {
    currentBook: null,
    pageTitle: 'Weekly Reading List',
    currentListId: readingList._id,
    weeklyReadings: buildWeeklyReadings(readingList),
  });
}

/**
 * Route: GET /
 * Purpose: Display a random weekly reading list.
 * Expected input: No parameters or request body.
 * Produced output: The rendered list.ejs page, or 404 when no list exists.
 * How it works: Samples one ReadingList and orders its books by SCHEDULE.
 * Example: GET http://localhost:4000/ displays three scheduled books.
 */
app.get('/', renderReadingList);

/**
 * Route: POST /
 * Purpose: Refresh the page with another random weekly reading list.
 * Expected input: Optional form field currentListId containing a MongoDB ID.
 * Produced output: The rendered list.ejs page with a new list when possible.
 * How it works: Excludes currentListId, samples a remaining list, then renders it.
 * Example: POST / with currentListId=68c5146cbb15b1b1b3f00101 refreshes the list.
 */
app.post('/', renderReadingList);

/**
 * Route: GET /book/:title
 * Purpose: Display one selected book and books from the same category.
 * Expected input: URL parameter title containing the encoded book title.
 * Produced output: The rendered book.ejs page, or 404 for an unknown title.
 * How it works: Finds the title, then queries other books in its category.
 * Example: GET /book/Socratic%20Logic displays Socratic Logic and related books.
 */
app.get('/book/:title', async (req, res) => {
  const book = await Book.findOne({ title: req.params.title });

  if (!book) {
    return res.status(404).send('Book not found.');
  }

  const relatedBooks = await Book.find({
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

/**
 * Route: ALL unmatched paths
 * Purpose: Return a clear response for every undefined URL.
 * Expected input: Any HTTP method and path not handled above.
 * Produced output: HTTP 404 with a short plain-text message.
 * How it works: Express reaches this route only when no earlier route matched.
 * Example: GET /unknown returns 404 Page not found.
 */
app.use((req, res) => {
  res.status(404).send('Page not found.');
});

// Convert unexpected route/database failures into one consistent 500 response.
app.use((error, req, res, next) => {
  console.error(error.message);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).send('Something went wrong. Please try again.');
});

/** Connect to MongoDB Atlas before accepting requests. */
async function startServer() {
  await connectDatabase();
  const port = getPort(process.env.PORT);

  app.listen(port, () => {
    console.log(`Server started and is running on: http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error(`Server could not start: ${error.message}`);
  process.exitCode = 1;
});
