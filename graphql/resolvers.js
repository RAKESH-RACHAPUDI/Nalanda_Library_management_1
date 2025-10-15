const User = require('../models/userModel');
const Book = require('../models/bookModel');
const Borrow = require('../models/borrowModel');
const generateToken = require('../utils/generateToken');

const resolvers = {
  Query: {
    // User Management
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },

    // Book Management
    listBooks: async (_, { page = 1, limit = 10, author, genre }) => {
      const query = {};
      if (author) query.author = author;
      if (genre) query.genre = genre;

      const books = await Book.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Book.countDocuments(query);
      return { total, page: Number(page), books };
    },

    // Borrowing System
    borrowHistory: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const history = await Borrow.find({ user: user._id })
        .populate('book', 'title author');
      return history;
    },

    // Reports
    mostBorrowedBooks: async () => {
      const data = await Borrow.aggregate([
        { $group: { _id: "$book", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails"
          }
        },
        { $unwind: "$bookDetails" },
        {
          $project: {
            _id: 0,
            title: "$bookDetails.title",
            author: "$bookDetails.author",
            count: 1
          }
        }
      ]);
      return data;
    },

    activeMembers: async () => {
      const data = await Borrow.aggregate([
        { $group: { _id: "$user", totalBorrows: { $sum: 1 } } },
        { $sort: { totalBorrows: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        { $unwind: "$userDetails" },
        {
          $project: {
            _id: 0,
            name: "$userDetails.name",
            email: "$userDetails.email",
            totalBorrows: 1
          }
        }
      ]);
      return data;
    },

    bookAvailability: async () => {
      const totalBooks = await Book.countDocuments();
      const totalBorrowed = await Borrow.countDocuments({ returnedAt: { $exists: false } });
      const availableBooks = totalBooks - totalBorrowed;
      return { totalBooks, totalBorrowed, availableBooks };
    },
  },

  Mutation: {
    // User Management
    registerUser: async (_, { name, email, password, role }) => {
      const userExists = await User.findOne({ email });
      if (userExists) throw new Error('User already exists');

      const user = await User.create({ name, email, password, role });
      const token = generateToken(user._id, user.role);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      };
    },

    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.role);
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        };
      } else {
        throw new Error('Invalid email or password');
      }
    },

    // Book Management (Admin only)
    addBook: async (_, args, { user }) => {
      if (!user || user.role !== 'Admin') throw new Error('Admin access required');
      const { title, author, ISBN, publicationDate, genre, copies } = args;
      const book = await Book.create({ title, author, ISBN, publicationDate, genre, copies });
      return book;
    },

    updateBook: async (_, { id, ...updates }, { user }) => {
      if (!user || user.role !== 'Admin') throw new Error('Admin access required');
      const book = await Book.findByIdAndUpdate(id, updates, { new: true });
      if (!book) throw new Error('Book not found');
      return book;
    },

    deleteBook: async (_, { id }, { user }) => {
      if (!user || user.role !== 'Admin') throw new Error('Admin access required');
      const book = await Book.findByIdAndDelete(id);
      if (!book) throw new Error('Book not found');
      return 'Book deleted successfully';
    },

    // Borrowing System
    borrowBook: async (_, { bookId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const book = await Book.findById(bookId);
      if (!book) throw new Error('Book not found');
      if (book.copies <= 0) throw new Error('No copies available');

      const borrow = await Borrow.create({ user: user._id, book: book._id });
      book.copies -= 1;
      await book.save();
      return borrow;
    },

    returnBook: async (_, { bookId }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const borrow = await Borrow.findOne({
        user: user._id,
        book: bookId,
        returnedAt: { $exists: false }
      }).sort({ borrowedAt: -1 });

      if (!borrow) throw new Error('Borrow record not found');
      borrow.returnedAt = new Date();
      await borrow.save();

      const book = await Book.findById(borrow.book);
      book.copies += 1;
      await book.save();
      return borrow;
    },
  },

  BorrowRecord: {
    user: async (parent) => await User.findById(parent.user),
    book: async (parent) => await Book.findById(parent.book),
  },

  BorrowHistory: {
    book: async (parent) => await Book.findById(parent.book),
  },
};

module.exports = resolvers;
