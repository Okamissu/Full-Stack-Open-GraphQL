const { v4: uuid } = require('uuid');

const { GraphQLError } = require('graphql/error');

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let result = [...books];

      if (args.author) {
        result = result.filter((b) => b.author === args.author);
      }

      if (args.genre) {
        result = result.filter((b) => b.genres.includes(args.genre));
      }

      return result;
    },
    allAuthors: () => authors,
  },

  Author: {
    bookCount: (root) => books.filter((book) => book.author === root.name).length,
  },

  Mutation: {
    addBook: (root, args) => {
      if (
        books.find(
          (b) =>
            b.author === args.author &&
            b.title === args.title &&
            b.published === args.published,
        )
      ) {
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

      if (!authors.find((a) => a.name === args.author)) {
        authors = authors.concat({ name: args.author, id: uuid() });
      }

      const book = { ...args, id: uuid() };
      books = books.concat(book);
      return book;
    },
    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name === args.name);

      if (!author) return null;

      const updatedAuthor = {
        ...author,
        born: args.setBornTo,
      };

      authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));

      return updatedAuthor;
    },
  },
};

module.exports = resolvers;
