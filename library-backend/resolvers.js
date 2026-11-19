const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};

      if (args.genre) {
        filter.genres = args.genre;
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author });

        if (!author) {
          return [];
        }

        filter.author = author._id;
      }

      return Book.find(filter).populate('author');
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id });
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (author) {
        const bookExists = await Book.exists({
          author: author._id,
          title: args.title,
          published: args.published,
        });

        if (bookExists) {
          throw new GraphQLError(
            `Book already exists on the server: ${args.title}, ${args.author}, ${args.published}`,
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: [args.title, args.author, args.published],
              },
            },
          );
        }
      }

      if (!author) {
        author = new Author({ name: args.author });

        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError(`Saving author failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          });
        }
      }

      const book = new Book({ ...args, author: author._id });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: [args.title, args.author, args.published],
            error,
          },
        });
      }

      // Populate author before returning so the mutation response includes author details
      return book.populate('author');
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError(`Updating author failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }

      return author;
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError(`Creating user failed: ${error.message}`, {
          extensions: 'BAD_USER_INPUT',
          invalidArgs: args.username,
          error,
        });
      }

      return user;
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode');
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },
};

module.exports = resolvers;
