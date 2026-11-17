const { GraphQLError } = require('graphql');

const Book = require('./models/book');
const Author = require('./models/author');

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      // .populate('author') ensures GraphQL can resolve book.author.name
      return Book.find({}).populate('author');
    },
    allAuthors: async () => Author.find({}),
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id });
    },
  },

  Mutation: {
    addBook: async (root, args) => {
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

    editAuthor: async (root, args) => {
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
  },
};

module.exports = resolvers;
