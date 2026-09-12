const assert = require('node:assert/strict');
const { afterEach, test } = require('node:test');

const { createApp, getPort } = require('../app');

const openServers = new Set();

const textbook = {
  _id: '68c5146cbb15b1b1b3f00001',
  title: 'Javascript The Definitive Guide',
  author: 'David Flanagan',
  year: 2011,
  image: 'https://example.com/javascript.jpg',
  category: 'TEXTBOOK',
  description: 'A JavaScript reference book.',
};

const philosophy = {
  _id: '68c5146cbb15b1b1b3f00002',
  title: 'The Republic',
  author: 'Plato',
  year: 2000,
  image: 'https://example.com/republic.jpg',
  category: 'PHILOSOPHY',
  description: 'A book about justice and the ideal state.',
};

const novel = {
  _id: '68c5146cbb15b1b1b3f00003',
  title: 'Harry Potter',
  author: 'J.K. Rowling',
  year: 1997,
  image: 'https://example.com/harry-potter.jpg',
  category: 'NOVEL',
  description: 'A story about a young wizard.',
};

const readingLists = [
  {
    _id: '68c5146cbb15b1b1b3f00101',
    name: 'Reading List 1',
    books: [textbook, philosophy, novel],
  },
  {
    _id: '68c5146cbb15b1b1b3f00102',
    name: 'Reading List 2',
    books: [textbook, philosophy, novel],
  },
];

function createReadingListModel() {
  const calls = [];

  return {
    calls,
    async aggregate(pipeline) {
      calls.push(pipeline);
      const matchStage = pipeline.find((stage) => stage.$match);
      const excludedId = matchStage?.$match?._id?.$ne?.toString();
      const selected = readingLists.find((list) => list._id !== excludedId);
      return selected ? [selected] : [];
    },
  };
}

function createBookModel() {
  const calls = { find: [], findOne: [] };

  return {
    calls,
    async find(filter) {
      calls.find.push(filter);
      return [
        { ...textbook, _id: '68c5146cbb15b1b1b3f00004', title: 'Software Engineering' },
      ];
    },
    async findOne(filter) {
      calls.findOne.push(filter);
      return filter.title === textbook.title ? textbook : null;
    },
  };
}

async function startServer(app) {
  const server = await new Promise((resolve) => {
    const listeningServer = app.listen(0, () => resolve(listeningServer));
  });
  openServers.add(server);

  const { port } = server.address();
  return { server, url: `http://127.0.0.1:${port}` };
}

afterEach(async () => {
  await Promise.all(
    [...openServers].map(
      (server) => new Promise((resolve) => server.close(resolve)),
    ),
  );
  openServers.clear();
});

test('GET / renders a dynamic list in the required weekday order', async () => {
  const ReadingListModel = createReadingListModel();
  const app = createApp({ ReadingListModel });
  const { url } = await startServer(app);

  const response = await fetch(`${url}/`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Kai Nguyen/);
  assert.match(html, /name="currentListId" value="68c5146cbb15b1b1b3f00101"/);
  assert.match(html, /href="\/book\/Javascript%20The%20Definitive%20Guide"/);
  assert.ok(html.indexOf('Monday-Wednesday') < html.indexOf('Thursday-Friday'));
  assert.ok(html.indexOf('Thursday-Friday') < html.indexOf('Saturday-Sunday'));
});

test('POST / excludes the current list when choosing the next random list', async () => {
  const ReadingListModel = createReadingListModel();
  const app = createApp({ ReadingListModel });
  const { url } = await startServer(app);

  const response = await fetch(`${url}/`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'currentListId=68c5146cbb15b1b1b3f00101',
  });
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /name="currentListId" value="68c5146cbb15b1b1b3f00102"/);
  assert.equal(
    ReadingListModel.calls[0][0].$match._id.$ne.toString(),
    '68c5146cbb15b1b1b3f00101',
  );
});

test('GET /book/:title renders the selected book and same-category books', async () => {
  const BookModel = createBookModel();
  const app = createApp({ BookModel });
  const { url } = await startServer(app);

  const response = await fetch(`${url}/book/${encodeURIComponent(textbook.title)}`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Javascript The Definitive Guide/);
  assert.match(html, /Related Books/);
  assert.match(html, /Software Engineering/);
  assert.deepEqual(BookModel.calls.findOne[0], { title: textbook.title });
  assert.equal(BookModel.calls.find[0].category, 'TEXTBOOK');
  assert.equal(BookModel.calls.find[0]._id.$ne, textbook._id);
});

test('unknown book and unknown route return 404 responses', async () => {
  const app = createApp({ BookModel: createBookModel() });
  const { url } = await startServer(app);

  const [bookResponse, routeResponse] = await Promise.all([
    fetch(`${url}/book/Unknown`),
    fetch(`${url}/unknown`),
  ]);

  assert.equal(bookResponse.status, 404);
  assert.equal(routeResponse.status, 404);
});

test('port uses the configured value and otherwise falls back to 3000', () => {
  assert.equal(getPort('4000'), 4000);
  assert.equal(getPort(undefined), 3000);
  assert.equal(getPort('not-a-port'), 3000);
});
