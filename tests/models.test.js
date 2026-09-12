const assert = require('node:assert/strict');
const { test } = require('node:test');

const { Book, ReadingList } = require('../db/bookModel');
const { books } = require('../db/seed');

const validBook = {
  title: 'Example Book',
  author: 'Example Author',
  year: 2025,
  image: 'https://example.com/book.jpg',
  category: 'TEXTBOOK',
  description: 'An example description.',
};

test('book schema requires every field listed in the assessment', () => {
  const error = new Book({}).validateSync();
  const requiredFields = [
    'title',
    'author',
    'year',
    'image',
    'category',
    'description',
  ];

  for (const field of requiredFields) {
    assert.ok(error.errors[field], `${field} should be required`);
  }
});

test('book category accepts only the three required enum values', () => {
  const validCategories = ['TEXTBOOK', 'PHILOSOPHY', 'NOVEL'];

  for (const category of validCategories) {
    assert.equal(new Book({ ...validBook, category }).validateSync(), undefined);
  }

  const invalidError = new Book({ ...validBook, category: 'POETRY' }).validateSync();
  assert.ok(invalidError.errors.category);
});

test('reading list requires exactly one embedded book per category', () => {
  const completeList = new ReadingList({
    name: 'Complete List',
    books: [
      validBook,
      { ...validBook, title: 'Philosophy', category: 'PHILOSOPHY' },
      { ...validBook, title: 'Novel', category: 'NOVEL' },
    ],
  });
  assert.equal(completeList.validateSync(), undefined);

  const duplicateList = new ReadingList({
    name: 'Duplicate List',
    books: [validBook, { ...validBook }, { ...validBook }],
  });
  assert.ok(duplicateList.validateSync().errors.books);
});

test('seed data contains all 14 starter books across the required categories', () => {
  assert.equal(books.length, 14);
  assert.equal(books.filter((book) => book.category === 'TEXTBOOK').length, 6);
  assert.equal(books.filter((book) => book.category === 'PHILOSOPHY').length, 5);
  assert.equal(books.filter((book) => book.category === 'NOVEL').length, 3);
});
