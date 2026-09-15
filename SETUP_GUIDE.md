# Hướng dẫn dựng Weekly Reading List từ số 0

Tài liệu này đi theo đúng thứ tự nên làm trong Git Bash: tạo project, cài package, cấu hình MongoDB Atlas, viết từng file, seed dữ liệu, chạy ứng dụng, kiểm tra, commit, push GitHub và chuẩn bị file ZIP.

> Không chép mật khẩu thật vào tài liệu hoặc GitHub. File `.env` chỉ nằm trên máy. Trong bài thi thật, luôn ưu tiên field, route, nội dung, tên folder và cơ chế search/filter/cookie được ghi trong đề của buổi thi.

## 1. Kết quả cuối cùng

Ứng dụng dùng:

- Node.js và Express cho server.
- EJS để render HTML từ dữ liệu.
- MongoDB Atlas và Mongoose cho database.
- Bootstrap cho grid, spacing, button và responsive utilities.
- CSS riêng cho phần giao diện đặc thù của mock test.

Luồng dữ liệu chính:

```text
Browser request
    -> Express route trong app.js
    -> Mongoose query MongoDB Atlas
    -> app.js chuẩn bị object cho view
    -> res.render(...)
    -> EJS tạo HTML
    -> Bootstrap + style.css trình bày giao diện
```

Các route:

| Method | URL | Chức năng |
|---|---|---|
| GET | `/` | Hiển thị một reading list ngẫu nhiên |
| POST | `/` | Refresh sang reading list khác |
| GET | `/book/:title` | Hiển thị sách và các sách cùng category |
| ALL | URL không tồn tại | Trả về 404 |

## 2. Kiểm tra công cụ

Mở Git Bash:

```bash
node --version
npm --version
git --version
```

Nếu cả ba lệnh đều in version thì tiếp tục. VS Code có thể mở bằng:

```bash
code --version
```

Dùng Node.js 18 trở lên vì project sử dụng Express 5. Kiểm tra Git identity trước commit đầu tiên:

```bash
git config --get user.name
git config --get user.email
```

Nếu một trong hai lệnh không in kết quả, cấu hình một lần:

```bash
git config --global user.name "Kai Nguyen"
git config --global user.email "EMAIL_DUNG_CHO_GITHUB"
```

## 3. Tạo project trống

Trong Git Bash:

```bash
cd "/c/Users/Khoai/RMIT/Web Programming Studio/Final exam"
mkdir materials
cd materials

git init
git branch -M main
npm init -y
```

Sửa metadata bằng CLI:

```bash
npm pkg set name="weekly-reading-list"
npm pkg set description="MongoDB-backed weekly reading list built with Express and EJS."
npm pkg set author="Kai Nguyen (s4126139)"
npm pkg set main="app.js"
npm pkg set scripts.start="node app.js"
npm pkg set scripts.seed="node db/seed.js"
npm pkg set scripts.check="node --check app.js && node --check db/bookModel.js && node --check db/mongoose.js && node --check db/seed.js && node --check public/app.js"
npm pkg set scripts.test="npm run check"
```

Cài đúng các version đã dùng cho project:

```bash
npm install express@5.1.0 ejs@3.1.10 mongoose@8.18.1 dotenv@17.2.2
```

Tạo folders và files:

```bash
mkdir -p db public/images views/partials

touch .env .env.example .gitignore
touch app.js
touch db/mongoose.js db/bookModel.js db/seed.js
touch public/app.js public/style.css
touch views/list.ejs views/book.ejs
touch views/partials/head.ejs views/partials/header.ejs views/partials/footer.ejs

code .
```

Không cần tạo folder `tests`. File `package-lock.json` được npm tự sinh; không viết thủ công.

## 4. Cấu trúc cuối cùng

```text
materials/
├── db/
│   ├── bookModel.js
│   ├── mongoose.js
│   └── seed.js
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── profile.png
│   ├── app.js
│   └── style.css
├── views/
│   ├── partials/
│   │   ├── footer.ejs
│   │   ├── head.ejs
│   │   └── header.ejs
│   ├── book.ejs
│   └── list.ejs
├── .env
├── .env.example
├── .gitignore
├── app.js
├── package-lock.json
└── package.json
```

## 5. Cấu hình files gốc

### `.gitignore`

```gitignore
node_modules/
.env
.DS_Store
npm-debug.log*
*.zip
```


Giải thích:

- `node_modules/` được cài lại bằng `npm install`, không commit.
- `.env` có mật khẩu Atlas nên không commit.
- ZIP nộp bài được tạo bên ngoài project.

### `.env.example`

```dotenv
PORT=4000
MONGODB_CONNECTION_STRING=mongodb+srv://<db_user>:<url_encoded_password>@<cluster_host>/<database_name>?retryWrites=true&w=majority&appName=Cluster0
```


Tạo `.env` theo cùng cấu trúc, nhưng thay placeholder bằng thông tin thật:

```dotenv
PORT=4000
MONGODB_CONNECTION_STRING=mongodb+srv://USERNAME:ENCODED_PASSWORD@CLUSTER_HOST/DATABASE_NAME?retryWrites=true&w=majority&appName=Cluster0
```

Không thêm dấu ngoặc `< >` quanh giá trị thật.

### `package.json`

```json
{
  "name": "weekly-reading-list",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "seed": "node db/seed.js",
    "check": "node --check app.js && node --check db/bookModel.js && node --check db/mongoose.js && node --check db/seed.js && node --check public/app.js",
    "test": "npm run check"
  },
  "keywords": [],
  "author": "Kai Nguyen (s4126139)",
  "license": "ISC",
  "description": "MongoDB-backed weekly reading list built with Express and EJS.",
  "dependencies": {
    "dotenv": "^17.2.2",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "mongoose": "^8.18.1"
  }
}
```


Sau khi sửa `package.json`, đồng bộ lockfile:

```bash
npm install
```

## 6. Tạo MongoDB Atlas

### 6.1 Tạo project và cluster

1. Vào [MongoDB Atlas](https://cloud.mongodb.com/).
2. Chọn **New Project** và đặt tên project.
3. Chọn **Create a Deployment**.
4. Chọn free cluster nếu bài không yêu cầu gói khác.
5. Đặt tên `Cluster0`.
6. Chọn region gần bạn.
7. Đợi cluster có dấu xanh Active.

### 6.2 Tạo database user

1. Mở **Security → Database Access**.
2. Chọn **Add New Database User**.
3. Chọn Password authentication.
4. Tạo username và password riêng cho database.
5. Role tối thiểu cho bài này là quyền đọc/ghi database.
6. Lưu password ở nơi an toàn; không commit vào Git.

Nếu password có ký tự đặc biệt, URL-encode bằng Node. Nhập password ẩn để nó không nằm trong shell history:

```bash
read -s -p "Atlas password: " ATLAS_PASSWORD
echo
ATLAS_PASSWORD="$ATLAS_PASSWORD" node -e "console.log(encodeURIComponent(process.env.ATLAS_PASSWORD))"
unset ATLAS_PASSWORD
```

Dùng kết quả đã encode trong URI.

### 6.3 Network Access

1. Mở **Security → Network Access**.
2. Chọn **Add IP Address**.
3. Khuyến nghị chọn **Add Current IP Address**.
4. Nếu môi trường lab thường đổi IP và giảng viên cho phép, có thể tạm dùng `0.0.0.0/0`; cấu hình này cho phép mọi IP nên phải xóa hoặc giới hạn lại sau khi dùng.
5. Đợi Status thành **Active**.

### 6.4 Lấy connection string

1. Tại **Database → Clusters**, chọn **Connect**.
2. Chọn **Drivers**.
3. Chọn Node.js.
4. Copy URI.
5. Thay username, encoded password và database name.
6. Dán vào `.env` dưới key `MONGODB_CONNECTION_STRING`.

Ví dụ cấu trúc, không phải credential thật:

```dotenv
PORT=4000
MONGODB_CONNECTION_STRING=mongodb+srv://kai:encoded_password@cluster0.example.mongodb.net/2026b_a4_s4126139?retryWrites=true&w=majority&appName=Cluster0
```

Kiểm tra `.env` không bị Git theo dõi:

```bash
git check-ignore .env
git ls-files .env
```

Lệnh đầu phải in `.env`; lệnh thứ hai không được in gì.

## 7. Viết lớp database

### `db/mongoose.js`

```javascript
/**
 * RMIT University Vietnam
 * Course: COSC3060 | COSC3061 Web Programming Studio
 * Semester: 2026B
 * Assessment: Full-Stack In-Class Lab Test
 * Author: Kai Nguyen
 * ID: s4126139
 * Acknowledgement: Mongoose, MongoDB Atlas, and dotenv documentation.
 */

const mongoose = require('mongoose');
require('dotenv').config({ quiet: true });

/** Connect once using the Atlas URI stored outside source control in .env. */
async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const connectionString = process.env.MONGODB_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error(
      'MONGODB_CONNECTION_STRING is missing. Add it to the .env file.',
    );
  }

  await mongoose.connect(connectionString);
  console.log('Connected to MongoDB Atlas');

  return mongoose.connection;
}

/** Close the active connection so CLI scripts can finish cleanly. */
async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  mongoose,
};
```


Điểm cần nhớ:

- `dotenv` đọc biến từ `.env`.
- Chỉ kết nối khi `connectDatabase()` được gọi.
- Seed script gọi `disconnectDatabase()` để CLI thoát sạch.

### `db/bookModel.js`

```javascript
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
```


Quan hệ dữ liệu:

- Collection `books` chứa toàn bộ sách.
- Một `ReadingList` embed đúng ba book subdocuments.
- Validator bắt buộc ba category khác nhau: TEXTBOOK, PHILOSOPHY và NOVEL.

## 8. Viết seed script

### `db/seed.js`

```javascript
/**
 * RMIT University Vietnam
 * Course: COSC3060 | COSC3061 Web Programming Studio
 * Semester: 2026B
 * Assessment: Full-Stack In-Class Lab Test
 * Author: Kai Nguyen
 * ID: s4126139
 * Acknowledgement: Mongoose, MongoDB Atlas, and Pexels.
 */

const { Book, ReadingList } = require('./bookModel');
const { connectDatabase, disconnectDatabase } = require('./mongoose');

// Starter records used to populate the Atlas books collection.
const books = [
  {
    title: 'Socratic Logic',
    author: 'Peter Kreeft',
    year: 1990,
    image: 'https://images.pexels.com/photos/26887007/pexels-photo-26887007.jpeg',
    category: 'TEXTBOOK',
    description: 'Socratic Logic is a comprehensive textbook on Aristotelian and Socratic logic, designed for students and general readers. It introduces the principles of classical logic, clear thinking, and argumentation, blending philosophical depth with practical exercises.'
  },
  {
    title: 'The Lord of the Ring',
    author: 'J.R.R. Tokien',
    year: 1937,
    image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
    category: 'NOVEL',
    description: 'The Lord of the Rings by J. R. R. Tolkien is an epic high-fantasy trilogy that follows the perilous journey of hobbit Frodo Baggins and his companions to destroy the One Ring, a powerful artifact sought by the dark lord Sauron, in a richly imagined world of adventure, courage, and friendship'
  },
  {
    title: 'Chronicles of Narnia',
    author: 'C.S. Lewis',
    year: 1954,
    image: 'https://images.pexels.com/photos/159778/books-reading-series-narnia-159778.jpeg',
    category: 'NOVEL',
    description: 'The Chronicles of Narnia is a beloved fantasy series that transports readers to the magical land of Narnia, where talking animals, mythical creatures, and epic battles between good and evil unfold.'
  },
  {
    title: 'Harry Potter',
    author: 'J.K. Rowling',
    year: 1997,
    image: 'https://images.pexels.com/photos/31269856/pexels-photo-31269856.jpeg',
    category: 'NOVEL',
    description: 'The story follows the young wizard Harry Potter and his friends Hermione Granger and Ron Weasley, all of whom are students at Hogwarts School of Witchcraft and Wizardry. The main plot concerns Harry\'s struggle against the dark wizard who aims to become immortal and conquer the wizarding world.'
  },
  {
    title: 'Software Engineering',
    author: 'Ian Sommerville',
    year: 2016,
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    category: 'TEXTBOOK',
    description: 'Software Engineering is a comprehensive textbook that covers the principles and practices of software engineering. It addresses the entire software development lifecycle, including requirements analysis, design, implementation, testing, and maintenance.'
  },

  {
    title: 'Screwtape Letters',
    author: 'C.S. Lewis',
    year: 1942,
    image: 'https://images.pexels.com/photos/51343/old-letters-old-letter-handwriting-51343.jpeg',
    category: 'PHILOSOPHY',
    description: 'The Screwtape Letters talks about a series of letters Screwtape, to his nephew, Wormwood. The letters offer advice on how to tempt and corrupt a human soul, providing insights into human nature, morality.'
  },
  {
    title: 'The Republic',
    author: 'Plato',
    year: 2000,
    image: 'https://images.pexels.com/photos/159862/art-school-of-athens-raphael-italian-painter-fresco-159862.jpeg',
    category: 'PHILOSOPHY',
    description: 'The Republic is a foundational philosophical text that explores justice, the ideal state, and the nature of the human soul. Through a series of dialogues led by Socrates, Plato examines the concept of justice, and the structure of an ideal society.'
  },
  {
    title: 'Javascript The Definitive Guide',
    author: 'David Flanagan',
    year: 2011,
    image: 'https://images.pexels.com/photos/1089440/pexels-photo-1089440.jpeg',
    category: 'TEXTBOOK',
    description: 'This  is a comprehensive reference book that covers the JavaScript programming language in depth. It provides detailed explanations of JavaScript core features, including syntax, data types, functions, and objects, as well as advanced topics like closures, prototypes, and asynchronous programming.'
  },
  {
    title: 'Ideas of a university',
    author: 'John Henry Newman',
    year: 1852,
    image: 'https://images.pexels.com/photos/14505030/pexels-photo-14505030.jpeg',
    category: 'PHILOSOPHY',
    description: "This is a work on the philosophy of education and the role of universities in society. Newman argues for the importance of a liberal education and the cultivation of the intellect, emphasizing the value of knowledge for its own sake."
  },
  {
    title: 'Research Methodology',
    author: 'C.R. Kothari',
    year: 2004,
    image: 'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg',
    category: 'TEXTBOOK',
    description: 'This is a comprehensive guide to the principles and practices of research in the social sciences. It covers various research methods, including qualitative and quantitative approaches, and provides practical guidance on designing and conducting research studies.'
  },
  {
    title: 'Pensées',
    author: 'Blaise Pascal',
    year: 1660,
    image: 'https://images.pexels.com/photos/20494169/pexels-photo-20494169.jpeg',
    category: 'PHILOSOPHY',
    description: 'This is a collection of thoughts and reflections on religion, philosophy, and human nature. Written in the 17th century, the work explores themes of faith, reason, and the human condition, and is considered a classic of French literature.'
  },
  {
    title: 'The Divine Comedy',
    author: 'Dante',
    year: 1984,
    image: 'https://images.pexels.com/photos/126271/pexels-photo-126271.jpeg',
    category: 'PHILOSOPHY',
    description: 'This is an epic poem that takes readers on a journey through the realms of Hell, Purgatory, and Paradise. Written in the 14th century, the poem explores themes of sin, redemption, and divine justice, and is considered one of the greatest works of world literature.'
  },
  {
    title: 'Data Structures and Algorithms using Python',
    author: 'Rance D. Necaise',
    year: 2011,
    image: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
    category: 'TEXTBOOK',
    description: 'This is a comprehensive textbook that covers fundamental data structures and algorithms using the Python programming language. It provides clear explanations of concepts such as arrays, linked lists, stacks, queues, trees, and graphs, along with practical examples and exercises.'
  },
  {
    title: 'R Graphics Cookbook',
    author: 'Winston Chang',
    year: 2013,
    image: 'https://images.pexels.com/photos/936135/pexels-photo-936135.jpeg',
    category: 'TEXTBOOK',
    description: 'This is a practical guide to creating visualizations using the R programming language. The book provides a collection of recipes for generating a wide range of plots and charts, along with tips and techniques for customizing and enhancing graphics in R.'
  },
];

/**
 * Replace old seed records with 14 books and 10 generated reading lists.
 * Each list contains one randomly selected book from every category.
 */
async function seed() {
  // Run the independent category samples in parallel to keep seeding fast.
  async function sampleBooksForCategories(categories) {
    const promises = categories.map((category) =>
      Book.aggregate([
        { $match: { category } },
        { $sample: { size: 1 } },
      ]),
    );
    const results = await Promise.all(promises);
    return results.map(([book]) => book).filter(Boolean);
  }

  try {
    await connectDatabase();

    // Clear only application collections so repeated seeding stays predictable.
    await Book.deleteMany({});
    console.log('Current books cleared!');
    await Book.insertMany(books);
    console.log('New books saved!');

    await ReadingList.deleteMany({});
    console.log('Current reading lists cleared!');

    const categories = ['TEXTBOOK', 'PHILOSOPHY', 'NOVEL'];
    const readingLists = [];

    for (let i = 1; i <= 10; i++) {
      const sampledBooks = await sampleBooksForCategories(categories);

      if (sampledBooks.length !== categories.length) {
        throw new Error(
          `Could not build Reading List ${i}: every category needs at least one book.`
        );
      }

      readingLists.push({ name: `Reading List ${i}`, books: sampledBooks });
    }

    if (readingLists.length !== 10) {
      throw new Error('Seeding must create exactly 10 reading lists.');
    }

    await ReadingList.insertMany(readingLists);
    console.log('New reading lists saved!');

    const bookCount = await Book.countDocuments();
    const readingListCount = await ReadingList.countDocuments();

    console.log('Checking DB for records...');
    console.log(`Total books in DB: ${bookCount}`);
    console.log(`Total reading lists in DB: ${readingListCount}`);

    return { bookCount, readingListCount };
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  seed().catch((error) => {
    console.error('Error in seeding:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { books, seed };
```


Chạy seed:

```bash
npm run seed
```

Kết quả quan trọng cần thấy:

```text
Connected to MongoDB Atlas
Current books cleared!
New books saved!
Current reading lists cleared!
New reading lists saved!
Checking DB for records...
Total books in DB: 14
Total reading lists in DB: 10
```

Cảnh báo: seed dùng `deleteMany({})` trên hai collection của ứng dụng. Chỉ chạy khi bạn muốn reset dữ liệu mẫu.

Kiểm tra trong Atlas Data Explorer:

```text
DATABASE_NAME
├── books          14 documents
└── readinglists   10 documents
```

## 9. Viết Express server và routes

### `app.js`

```javascript
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
```


Cách đọc `app.js` theo thứ tự:

1. Import packages, models và database connection.
2. Tạo `app` và khai báo `SCHEDULE`.
3. Cấu hình EJS, form parser và static folder.
4. Query một reading list ngẫu nhiên.
5. Biến dữ liệu database thành `weeklyReadings`.
6. Route gọi `res.render()` và truyền object sang EJS.
7. 404 và error middleware nằm cuối.
8. Kết nối Atlas trước, rồi mới `app.listen()`.

Object truyền vào `list.ejs`:

```javascript
{
  currentBook: null,
  pageTitle: 'Weekly Reading List',
  currentListId: readingList._id,
  weeklyReadings: buildWeeklyReadings(readingList)
}
```

Object truyền vào `book.ejs`:

```javascript
{
  book,
  currentBook: book,
  pageTitle: book.title,
  relatedBooks
}
```

Đây là nguyên tắc quan trọng: query và xử lý dữ liệu trong `app.js`; EJS chủ yếu lặp và in dữ liệu.

## 10. Viết EJS partials

### `views/partials/head.ejs`

```ejs
<%#
  RMIT University Vietnam
  Course: COSC3060 | COSC3061 Web Programming Studio
  Semester: 2026B
  Assessment: Full-Stack In-Class Lab Test
  Author: Kai Nguyen
  ID: s4126139
  Acknowledgement: Bootstrap and EJS documentation.
%>
<%# Shared metadata and stylesheets used by both pages. %>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><%= pageTitle ? `${pageTitle} | ` : '' %>Kai Nguyen's Weekly Readings</title>
<link rel="icon" type="image/png" href="/images/logo.png">
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
  rel="stylesheet"
  integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
  crossorigin="anonymous"
>
<link rel="stylesheet" href="/style.css">
```


Bootstrap CSS được dùng cho container, grid, spacing, flex, button và responsive utilities. Không cần Bootstrap JavaScript vì ứng dụng không dùng modal, dropdown, collapse hoặc component tương tác của Bootstrap.

### `views/partials/header.ejs`

```ejs
<%#
  RMIT University Vietnam
  Course: COSC3060 | COSC3061 Web Programming Studio
  Semester: 2026B
  Assessment: Full-Stack In-Class Lab Test
  Author: Kai Nguyen
  ID: s4126139
  Acknowledgement: Bootstrap and EJS documentation.
%>
<%# Shared logo and breadcrumb navigation; the book crumb is conditional. %>
<header class="site-header py-4 d-flex flex-column flex-lg-row align-items-center gap-3">
  <a class="brand-link" href="/" aria-label="Kai Nguyen's weekly readings home">
    <img class="site-logo" src="/images/logo.png" alt="Weekly readings logo" width="64" height="64">
  </a>

  <nav class="site-nav d-flex flex-wrap align-items-center justify-content-center gap-2" aria-label="Breadcrumb">
    <a href="/">Home Page</a>
    <% if (currentBook) { %>
      <span aria-hidden="true">&gt;</span>
      <a href="/book/<%= encodeURIComponent(currentBook.title) %>" aria-current="page"><%= currentBook.title %></a>
    <% } %>
  </nav>
</header>
```


`currentBook` quyết định có hiển thị breadcrumb tên sách hay không.

### `views/partials/footer.ejs`

```ejs
<%#
  RMIT University Vietnam
  Course: COSC3060 | COSC3061 Web Programming Studio
  Semester: 2026B
  Assessment: Full-Stack In-Class Lab Test
  Author: Kai Nguyen
  ID: s4126139
  Acknowledgement: Bootstrap and EJS documentation.
%>
<%# Shared authorship footer used on the list and detail pages. %>
<footer class="site-footer mt-auto py-4 text-center">
  Made with 👌 by <strong>Kai Nguyen</strong>
</footer>
```


## 11. Viết hai EJS pages

### `views/list.ejs`

```ejs
<%#
  RMIT University Vietnam
  Course: COSC3060 | COSC3061 Web Programming Studio
  Semester: 2026B
  Assessment: Full-Stack In-Class Lab Test
  Author: Kai Nguyen
  ID: s4126139
  Acknowledgement: Bootstrap, EJS, and the supplied interface reference.
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <%- include('partials/head') %>
</head>
<body class="container min-vh-100 d-flex flex-column">
  <%- include('partials/header') %>

  <main class="row g-4 align-items-stretch flex-grow-1 pb-3">
    <%# Static student profile shown beside every generated reading list. %>
    <aside class="col-lg-4" aria-label="Student profile">
      <section id="profile" class="profile-panel h-100 d-flex flex-column align-items-center">
        <img
          class="profile-photo rounded-circle"
          src="/images/profile.png"
          alt="Profile portrait of Kai Nguyen"
          width="250"
          height="250"
        >

        <div class="profile-copy text-center text-lg-start">
          <p class="profile-intro mb-1">Hi, I'm</p>
          <h1 class="profile-name mb-4">Kai Nguyen</h1>
          <address class="profile-details mb-0">
            <strong>s4126139</strong><br>
            <a href="mailto:s4126139@rmit.edu.vn">s4126139@rmit.edu.vn</a>
          </address>
        </div>
      </section>
    </aside>

    <%# Dynamic schedule prepared by app.js and rendered in weekday order. %>
    <section id="reading-list" class="col-lg-8" aria-labelledby="reading-list-title">
      <h2 id="reading-list-title" class="reading-title text-center">
        Recommended <strong>READING LIST</strong>
      </h2>

      <form class="refresh-form d-flex justify-content-center justify-content-lg-end" action="/" method="post" data-refresh-form>
        <%# The current ID lets POST / request a different random list. %>
        <input type="hidden" name="currentListId" value="<%= currentListId %>">
        <button class="btn btn-primary refresh-button" type="submit" data-refresh-button>
          <span data-refresh-label>Refresh</span>
        </button>
      </form>

      <% weeklyReadings.forEach(({ days, book }) => { %>
        <section class="reading-slot" aria-labelledby="slot-<%= book.category.toLowerCase() %>">
          <h3 id="slot-<%= book.category.toLowerCase() %>" class="reading-days"><%= days %></h3>

          <article class="card reading-card overflow-hidden">
            <div class="card-body reading-card-body">
              <h4 class="card-title reading-book-title">
                <a href="/book/<%= encodeURIComponent(book.title) %>"><%= book.title %> by <%= book.author %></a>
              </h4>
              <p class="card-text reading-description"><%= book.description %></p>
              <p class="reading-category mb-0"><%= book.category %></p>
            </div>
            <img
              class="reading-cover"
              src="<%= book.image %>"
              alt="Cover illustration for <%= book.title %>"
            >
          </article>
        </section>
      <% }); %>
    </section>
  </main>

  <%- include('partials/footer') %>

  <script src="/app.js" defer></script>
</body>
</html>
```


Điểm quan trọng:

- GET và POST cùng hiển thị page này.
- Hidden input gửi `currentListId` để Refresh có thể loại list hiện tại.
- `weeklyReadings` đã được chuẩn bị trong server nên EJS không cần `.find()`.
- `encodeURIComponent()` giúp title có khoảng trắng hoạt động an toàn trong URL.

### `views/book.ejs`

```ejs
<%#
  RMIT University Vietnam
  Course: COSC3060 | COSC3061 Web Programming Studio
  Semester: 2026B
  Assessment: Full-Stack In-Class Lab Test
  Author: Kai Nguyen
  ID: s4126139
  Acknowledgement: Bootstrap, EJS, and the supplied interface reference.
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <%- include('partials/head') %>
</head>
<body class="container min-vh-100 d-flex flex-column">
  <%- include('partials/header') %>

  <main class="flex-grow-1">
    <%# The selected book is displayed over its image in the hero panel. %>
    <article class="book-hero position-relative overflow-hidden">
      <img class="book-hero-image" src="<%= book.image %>" alt="Cover illustration for <%= book.title %>">
      <div class="book-hero-content position-relative text-white">
        <h1><%= book.title %></h1>
        <h2>By <%= book.author %></h2>
        <p class="book-description"><%= book.description %></p>
        <p class="book-meta mb-0"><strong><%= book.category %> | Published in <%= book.year %></strong></p>
      </div>
    </article>

    <%# app.js supplies every other book that shares this book's category. %>
    <section class="related-section" aria-labelledby="related-title">
      <h2 id="related-title">Related Books</h2>

      <div class="row g-4">
        <% relatedBooks.forEach((relatedBook) => { %>
          <div class="col-lg-4">
            <a class="related-card d-block position-relative overflow-hidden" href="/book/<%= encodeURIComponent(relatedBook.title) %>">
              <img
                class="related-image"
                src="<%= relatedBook.image %>"
                alt="Cover illustration for <%= relatedBook.title %>"
              >
              <span class="related-title position-absolute"><%= relatedBook.title %> By <%= relatedBook.author %></span>
            </a>
          </div>
        <% }); %>
      </div>
    </section>

    <form class="back-form d-flex justify-content-center" action="/" method="get">
      <button id="btn-back" class="btn btn-primary back-button" type="submit">Back</button>
    </form>
  </main>

  <%- include('partials/footer') %>
</body>
</html>
```


`relatedBooks` được query theo cùng category và loại book hiện tại bằng `$ne`.

## 12. Viết client JavaScript và CSS

### `public/app.js`

```javascript
/**
 * RMIT University Vietnam
 * Course: COSC3060 | COSC3061 Web Programming Studio
 * Semester: 2026B
 * Assessment: Full-Stack In-Class Lab Test
 * Author: Kai Nguyen
 * ID: s4126139
 * Acknowledgement: MDN Web Docs for browser DOM APIs.
 */

// The form still works without JavaScript; this only communicates loading state.
const refreshForm = document.querySelector('[data-refresh-form]');

if (refreshForm) {
  const refreshButton = refreshForm.querySelector('[data-refresh-button]');
  const refreshLabel = refreshForm.querySelector('[data-refresh-label]');

  refreshForm.addEventListener('submit', () => {
    refreshButton.disabled = true;
    refreshButton.setAttribute('aria-busy', 'true');
    refreshLabel.textContent = 'Refreshing...';
  });

  // Restore the button when the user returns through the browser back/forward cache.
  window.addEventListener('pageshow', () => {
    refreshButton.disabled = false;
    refreshButton.removeAttribute('aria-busy');
    refreshLabel.textContent = 'Refresh';
  });
}
```


Form vẫn hoạt động nếu JavaScript tắt. Script chỉ disable button và đổi label trong lúc request đang chạy.

### `public/style.css`

```css
/*
 * RMIT University Vietnam
 * Course: COSC3060 | COSC3061 Web Programming Studio
 * Semester: 2026B
 * Assessment: Full-Stack In-Class Lab Test
 * Author: Kai Nguyen
 * ID: s4126139
 * Acknowledgement: Bootstrap and the supplied interface reference.
 */

/* Shared colour tokens and page typography. */
:root {
  --rmit-blue: #00005b;
  --bootstrap-blue: #0d6efd;
  --body-text: #212529;
  --muted-text: #6c757d;
}

body {
  background: #ffffff;
  color: var(--body-text);
  font-family: Arial, Helvetica, sans-serif;
}

/* Shared logo and breadcrumb navigation. */
.brand-link,
.site-nav a {
  border-radius: 0.25rem;
}

.site-logo {
  display: block;
  object-fit: contain;
}

.site-nav a {
  padding: 0.4rem 0.55rem;
  color: var(--bootstrap-blue);
  text-decoration: none;
  transition: background-color 160ms ease, color 160ms ease;
}

.site-nav a:hover {
  background-color: var(--bootstrap-blue);
  color: #ffffff;
}

.brand-link:focus-visible,
.site-nav a:focus-visible,
.reading-book-title a:focus-visible,
.related-card:focus-visible,
.btn:focus-visible,
.profile-details a:focus-visible {
  outline: 3px solid rgba(13, 110, 253, 0.45);
  outline-offset: 3px;
}

/* Student profile panel on the reading-list page. */
.profile-panel {
  min-height: 100%;
  padding: 1rem;
  border-radius: 1.25rem;
  background: var(--rmit-blue);
  color: #ffffff;
}

.profile-photo {
  display: block;
  object-fit: cover;
}

.profile-copy {
  width: 100%;
  margin-top: 1.5rem;
}

.profile-name {
  font-size: clamp(2.5rem, 4vw, 3.2rem);
  font-weight: 700;
  line-height: 1;
}

.profile-details {
  font-style: italic;
  line-height: 1.5;
}

.profile-details a {
  color: inherit;
  text-decoration: none;
}

/* Weekly reading-list heading, refresh control, and book cards. */
.reading-title {
  margin: 0 0 1.25rem;
  font-size: 2rem;
  font-weight: 400;
}

.reading-title strong {
  font-weight: 700;
}

.refresh-form {
  margin-bottom: 1.5rem;
}

.refresh-button,
.back-button {
  width: 200px;
  min-height: 38px;
}

.reading-slot + .reading-slot {
  margin-top: 1.25rem;
}

.reading-days {
  margin: 0 0 0.65rem;
  font-size: 1.75rem;
  font-weight: 600;
}

.reading-card {
  display: grid;
  grid-template-columns: 1fr;
  border-color: #d6d6d6;
  border-radius: 0.3rem;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.reading-card:hover {
  border-color: #b8c9e6;
  box-shadow: 0 0.4rem 1rem rgba(33, 37, 41, 0.08);
}

.reading-card-body {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.reading-book-title {
  margin-bottom: 0.35rem;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.25;
}

.reading-book-title a {
  color: var(--bootstrap-blue);
  text-decoration: none;
}

.reading-book-title a:hover {
  text-decoration: underline;
}

.reading-description {
  margin-bottom: 1rem;
  line-height: 1.45;
}

.reading-category {
  margin-top: auto;
  color: var(--muted-text);
  font-size: 0.78rem;
}

.reading-cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Selected-book hero section. */
.book-hero {
  min-height: 540px;
  border-radius: 0.3rem;
  background: #111111;
}

.book-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.43));
  pointer-events: none;
}

.book-hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-hero-content {
  z-index: 2;
  padding: 3rem;
}

.book-hero-content h1 {
  margin-bottom: 0.65rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.book-hero-content h2 {
  margin-bottom: 1.7rem;
  font-size: 2rem;
  font-weight: 700;
}

.book-description {
  margin-bottom: 1.8rem;
  font-size: 1.5rem;
  line-height: 1.5;
}

.book-meta {
  font-size: 1.25rem;
}

/* Related-book cards and shared detail-page controls. */
.related-section {
  margin-top: 3rem;
}

.related-section > h2 {
  margin-bottom: 0.65rem;
  font-size: 2rem;
  font-weight: 600;
}

.related-card {
  height: 300px;
  border-radius: 0.3rem;
  background: #222222;
  color: #ffffff;
  text-decoration: none;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.related-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(110deg, rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.08));
  pointer-events: none;
}

.related-card:hover {
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 0.75rem 1.5rem rgba(33, 37, 41, 0.2);
}

.related-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-title {
  top: 1.5rem;
  left: 1.25rem;
  z-index: 2;
  max-width: calc(100% - 2.5rem);
  font-size: 1.55rem;
  line-height: 1.5;
}

.back-form {
  margin-top: 2rem;
}

.site-footer {
  font-size: 0.9rem;
}

/* Bootstrap's large breakpoint: display list-card content in two columns. */
@media (min-width: 992px) {
  .reading-card {
    min-height: 260px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .reading-cover {
    min-height: 260px;
  }
}

/* Tablet and mobile layout adjustments. */
@media (max-width: 991.98px) {
  .site-header {
    padding-top: 1.1rem !important;
    padding-bottom: 1.25rem !important;
  }

  .profile-panel {
    margin-inline: -0.75rem;
    padding: 1rem 1.25rem 3.15rem;
  }

  .profile-copy {
    margin-top: 1.25rem;
  }

  .reading-title {
    margin-top: 0.2rem;
    font-size: 1.75rem;
  }

  .reading-days {
    font-size: 1.55rem;
  }

  .reading-card-body {
    padding: 2rem 1.5rem 1.35rem;
  }

  .reading-cover {
    width: calc(100% - 1.5rem);
    height: auto;
    margin: 0 0.75rem 0.75rem;
    aspect-ratio: 3 / 2;
  }

  .book-hero {
    min-height: 602px;
  }

  .book-hero-content {
    padding: 3.5rem 3rem 3rem;
  }

  .book-hero-content h1 {
    font-size: 2rem;
  }

  .book-hero-content h2 {
    font-size: 1.7rem;
  }

  .book-description {
    font-size: 1.25rem;
    line-height: 1.7;
  }

  .book-meta {
    font-size: 1.05rem;
  }

  .related-section .row {
    padding-inline: 1rem;
  }

  .related-section > h2 {
    text-align: center;
    font-size: 1.75rem;
  }
}

/* Small-phone typography and spacing adjustments. */
@media (max-width: 575.98px) {
  .profile-photo {
    width: min(250px, 74vw);
    height: min(250px, 74vw);
  }

  .profile-name {
    font-size: 2.5rem;
  }

  .book-hero-content {
    padding: 2.4rem 2rem;
  }

  .related-title {
    font-size: 1.35rem;
  }
}

/* Respect visitors who prefer little or no animation. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```


Bootstrap lo phần bố cục chung; CSS riêng chỉ giữ màu, ảnh, kích thước và giao diện đặc thù để khớp mockup.

## 13. Thêm images

Copy hai file được đề cung cấp vào:

```text
public/images/logo.png
public/images/profile.png
```

Kiểm tra đúng tên và đúng chữ hoa/thường:

```bash
ls -l public/images
```

Không đặt ảnh vào `views`; Express chỉ public trực tiếp nội dung trong `public/`.

## 14. Thứ tự chạy chuẩn

Mỗi lần clone hoặc tạo project:

```bash
npm install
```

Lần đầu hoặc khi cần reset dữ liệu:

```bash
npm run seed
```

Kiểm tra cú pháp:

```bash
npm run check
npm test
```

Hai lệnh trên phải kết thúc không có SyntaxError.

Khởi động server:

```bash
npm start
```

Kết quả:

```text
Connected to MongoDB Atlas
Server started and is running on: http://localhost:4000
```

Mở:

```text
http://localhost:4000
```

Dừng server trong Git Bash:

```text
Ctrl + C
```

## 15. Checklist kiểm tra chức năng

1. GET `/` hiển thị profile và ba lịch đọc.
2. Thứ tự là Monday-Wednesday, Thursday-Friday, Saturday-Sunday.
3. Mỗi slot có title, author, description, category và image.
4. Refresh trả về page mới, không treo button.
5. Click title mở `/book/:title`.
6. Detail page có title, author, description, category và year.
7. Related Books chỉ chứa cùng category và không chứa chính book hiện tại.
8. Back quay về homepage.
9. URL không tồn tại trả về 404.
10. Desktop và mobile không tràn ngang.

Có thể smoke-test route bằng Git Bash trong khi server đang chạy:

```bash
curl -I http://localhost:4000/
curl -I http://localhost:4000/style.css
curl -i http://localhost:4000/unknown
```

Lưu ý: `curl -I` gửi HEAD. Nếu đề yêu cầu kiểm tra đúng GET body, dùng:

```bash
curl http://localhost:4000/
```

## 16. Git commits theo từng giai đoạn

Không bao giờ chạy `git add .env`.

### Commit 1: Node project và configuration

```bash
git add package.json package-lock.json .gitignore .env.example
git commit -m "chore: initialize Node and Express project"
```

### Commit 2: Atlas connection và schemas

```bash
git add db/mongoose.js db/bookModel.js
git commit -m "feat(database): add Atlas connection and Mongoose models"
```

### Commit 3: Seed data

```bash
git add db/seed.js
git commit -m "feat(database): add books and reading-list seed data"
```

### Commit 4: Express routes

```bash
git add app.js
git commit -m "feat(server): add reading-list and book routes"
```

### Commit 5: EJS pages và partials

```bash
git add views
git commit -m "feat(ui): add EJS list and book pages"
```

### Commit 6: Bootstrap styling, client behavior và images

```bash
git add public
git commit -m "style(ui): match responsive assessment interface"
```

### Commit 7: Guide

```bash
git add SETUP_GUIDE.md
git commit -m "docs: add complete setup guide"
```

Kiểm tra trước mỗi commit:

```bash
git status
git diff --check
git diff --cached --check
```

Xem lịch sử:

```bash
git log --oneline --decorate
```

## 17. Push lên GitHub

Cách nhanh với GitHub CLI:

```bash
gh --version
gh auth login
gh repo create s4126139/materials --private --source=. --remote=origin --push
```

Nếu repository đã được tạo trên GitHub:

```bash
git remote -v
git remote add origin https://github.com/s4126139/materials.git
git push -u origin main
```

Lệnh `git remote add` chỉ dùng khi chưa có remote tên `origin`. Nếu `git remote -v` cho thấy `origin` đã tồn tại nhưng trỏ sai repository, sửa URL rồi push:

```bash
git remote set-url origin https://github.com/s4126139/materials.git
git push -u origin main
```

Các lần sau:

```bash
git add app.js views/list.ejs
git commit -m "type(scope): describe the change"
git push
```

Kiểm tra không push secret:

```bash
git ls-files .env
git grep "mongodb+srv://"
```

Lệnh đầu không được in gì. Lệnh thứ hai có thể thấy URI mẫu trong `.env.example` và `SETUP_GUIDE.md`, nhưng mọi URI đó phải dùng placeholder hoặc dữ liệu giả; tuyệt đối không được thấy username/password thật.

## 18. Tạo ZIP nộp Canvas

Rubric yêu cầu tên:

```text
2026B_A4_s4126139.zip
```

Tạo ZIP từ folder cha bằng PowerShell được gọi trong Git Bash:

```bash
cd ..
powershell.exe -NoProfile -Command "Compress-Archive -Path 'materials/app.js','materials/package.json','materials/package-lock.json','materials/.env.example','materials/.gitignore','materials/db','materials/views','materials/public' -DestinationPath '2026B_A4_s4126139.zip' -Force"
```

ZIP mặc định trên không chứa `node_modules`, `.git` hoặc secret `.env`. Nếu đề thi thật yêu cầu marker kết nối trực tiếp bằng credential, chỉ thêm `.env` vào ZIP Canvas khi đề ghi rõ; vẫn không được push `.env` lên GitHub.

Kiểm tra file ZIP:

```bash
powershell.exe -NoProfile -Command "Get-Item '2026B_A4_s4126139.zip' | Select-Object Name,Length"
```

Không nộp ZIP chứa project lồng như `materials/materials`.

## 19. Troubleshooting MongoDB Atlas

### Thiếu biến môi trường

Thông báo:

```text
MONGODB_CONNECTION_STRING is missing
```

Kiểm tra:

```bash
pwd
ls -la
```

Bạn phải chạy npm trong folder chứa `.env`.

### Authentication failed

Kiểm tra:

- Username có đúng Database User không.
- Password đã URL-encode chưa.
- Không để placeholder hoặc dấu `< >`.
- User có quyền read/write.
- URI có đúng cluster host.

### Server selection hoặc IP access list

Kiểm tra:

- Cluster có Active không.
- Network Access có current IP và status Active không.
- VPN/proxy có đang đổi route không.
- Thử Wi-Fi khác hoặc mobile hotspot nếu mạng chặn TLS cổng 27017.

Trên Windows, từ Git Bash:

```bash
powershell.exe -NoProfile -Command "Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name,InterfaceDescription"
powershell.exe -NoProfile -Command "Get-NetRoute -AddressFamily IPv4 -DestinationPrefix '0.0.0.0/0' | Sort-Object RouteMetric | Format-Table InterfaceAlias,NextHop,RouteMetric"
```

Nếu route đi qua `ProTUN` dù Proton VPN đã tắt, thoát Proton VPN hoàn toàn hoặc vô hiệu hóa adapter ProTUN rồi thử lại. Không thay đổi network adapter trong lúc thi nếu bạn không hiểu tác động.

### Port 4000 đang được dùng

```bash
powershell.exe -NoProfile -Command "Get-NetTCPConnection -State Listen -LocalPort 4000 | Select-Object OwningProcess"
```

Dừng server cũ bằng `Ctrl + C`, hoặc đổi `PORT` trong `.env`.

### EJS báo biến chưa được định nghĩa

So sánh key trong `res.render()` với biến dùng trong EJS. Ví dụ `weeklyReadings` phải được truyền từ route trước khi view dùng:

```ejs
<% weeklyReadings.forEach(({ days, book }) => { %>
```

## 20. Đối chiếu rubric 40 điểm

### Part 1 - Configuration

- Dependencies cài đúng.
- EJS, static folder và form parser được cấu hình.
- `.env` chứa PORT và Atlas URI.
- `.env.example` có placeholder.
- `.env` không bị Git theo dõi.

### Part 2 - Database

- Book schema có đủ sáu fields.
- Category dùng enum.
- ReadingList embed books theo yêu cầu.
- Validator bắt buộc đúng ba category.
- Seed tạo 14 books và 10 reading lists hợp lệ.

### Part 3 - NodeJS Backend

- Server chỉ listen sau khi kết nối Atlas.
- GET, POST, detail, 404 và error flow hoạt động.
- Logic database nằm trong server, không nằm trong EJS.
- Không có test scaffolding hoặc function export thừa.
- Search/filter/cookies chỉ thêm nếu đề thật yêu cầu và phải dùng đúng client-side/server-side mechanism được ghi trong đề.

### Part 4 - Frontend

- Head, header và footer dùng EJS partials.
- Bootstrap và custom CSS đều link đúng.
- Images và client JS nằm trong `public/`.
- UI desktop/mobile khớp reference.
- Không có wrapper `div` hoặc Bootstrap JavaScript thừa.

### Part 5 - Code quality và submission

- Mỗi source JS/CSS/EJS có header 2026B.
- Mỗi route có Purpose, Input, Output, How và Example.
- Tên biến/function/class có ý nghĩa.
- Indentation và dấu phẩy nhất quán.
- Không có nested duplicate project.
- ZIP đúng tên và đủ files cần thiết.

## 21. Thứ tự làm nhanh khi nhận đề thật

1. Đọc toàn bộ yêu cầu và screenshot/video.
2. Ghi ra schemas, relationships, seed counts, routes và exact text.
3. Đổi header nếu semester/assessment khác.
4. Sửa model trước.
5. Sửa seed và chạy seed.
6. Sửa route/query.
7. Chuẩn bị object cho EJS.
8. Sửa EJS partials/pages.
9. Dùng Bootstrap trước, CSS riêng sau.
10. Chạy `npm test`, `npm run seed`, `npm start`.
11. Test desktop/mobile và error paths.
12. Kiểm tra `.env`, Git status và ZIP.
13. Chỉ nộp sau khi mở ZIP và xác nhận đúng cấu trúc.
