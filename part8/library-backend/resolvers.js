const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { bookCntByAuthLoader } = require('./loaders')

const resolvers = {
  Query: {
    authorCount: async () => {
      Author.collection.countDocuments()
    },
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.genre && !args.author) {
        return Book.find({}).populate('author')
      }
      if (args.genre && !args.author) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
      }
      if (args.author && !args.genre) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        return Book.find({ author: author._id }).populate('author')
      }
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        return Book.find({
          author: author._id,
          genres: { $in: [args.genre] },
        }).populate('author')
      }
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const authorIds = authors.map((author) => author._id)
      const bookCounts = await bookCntByAuthLoader.loadMany(authorIds)
      console.log('bookCounts', bookCounts)
      const authorsWithBookCount = authors.map((author, index) => ({
        ...author._doc,
        bookCount: bookCounts[index],
      }))
      console.log('authorsWithBookCount', authorsWithBookCount)
      return authorsWithBookCount
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      console.log('addingBook')
      const author = await Author.findOne({ name: args.author })
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      let book
      if (!author) {
        const newAuthor = new Author({ name: args.author })
        try {
          const result = await newAuthor.save()
          book = new Book({ ...args, author: result })
        } catch (error) {
          throw new GraphQLError('Saving new author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        }
      } else {
        book = new Book({ ...args, author: author })
      }
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      const updatedAuthor = {
        ...author._doc,
        born: args.setBornTo,
      }
      try {
        result = await Author.findByIdAndUpdate(author._id, updatedAuthor, {
          new: true,
        })
        return result
      } catch (error) {
        throw new GraphQLError('Updating author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      const token = jwt.sign(userForToken, process.env.JWT_SECRET)

      return { value: token }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
