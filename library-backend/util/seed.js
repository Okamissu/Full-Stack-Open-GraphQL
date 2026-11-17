const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../.env'),
});
const connectToDatabase = require('../db');

const MONGODB_URI = process.env.MONGODB_URI;

const Book = require('../models/book');
const Author = require('../models/author');

const seedDatabase = async () => {
  try {
    await connectToDatabase(MONGODB_URI);

    await Author.deleteMany({});
    await Book.deleteMany({});

    const authors = [
      { _id: '6afc5eff6c3705954f6094fa', name: 'Robert Martin', born: 1952 },
      { _id: '6afc5eff6c3705954f6094fb', name: 'Martin Fowler', born: 1963 },
      { _id: '6afc5eff6c3705954f6094fc', name: 'Fyodor Dostoevsky', born: 1821 },
      { _id: '6afc5eff6c3705954f6094fd', name: 'Joshua Kerievsky' },
      { _id: '6afc5eff6c3705954f6094fe', name: 'Sandi Metz' },
    ];

    await Author.insertMany(authors);

    const books = [
      {
        title: 'Clean Code',
        published: 2008,
        author: '6afc5eff6c3705954f6094fa',
        genres: ['refactoring'],
      },
      {
        title: 'Agile software development',
        published: 2002,
        author: '6afc5eff6c3705954f6094fa',
        genres: ['agile', 'patterns', 'design'],
      },
      {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: '6afc5eff6c3705954f6094fb',
        genres: ['refactoring'],
      },
      {
        title: 'Refactoring to patterns',
        published: 2008,
        author: '6afc5eff6c3705954f6094fd',
        genres: ['refactoring', 'patterns'],
      },
      {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: '6afc5eff6c3705954f6094fe',
        genres: ['refactoring', 'design'],
      },
      {
        title: 'Crime and punishment',
        published: 1866,
        author: '6afc5eff6c3705954f6094fc',
        genres: ['classic', 'crime'],
      },
      {
        title: 'Demons',
        published: 1872,
        author: '6afc5eff6c3705954f6094fc',
        genres: ['classic', 'revolution'],
      },
    ];

    await Book.insertMany(books);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
