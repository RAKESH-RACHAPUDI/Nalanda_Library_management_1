const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String
  }

  type Book {
    _id: ID!
    title: String!
    author: String!
    ISBN: String!
    publicationDate: String
    genre: String
    copies: Int!
    createdAt: String
  }

  type BorrowRecord {
    _id: ID!
    user: User!
    book: Book!
    borrowedAt: String!
    returnedAt: String
  }

  type AuthPayload {
    _id: ID!
    name: String!
    email: String!
    role: String!
    token: String!
  }

  type BookList {
    total: Int!
    page: Int!
    books: [Book!]!
  }

  type BorrowHistory {
    _id: ID!
    book: Book!
    borrowedAt: String!
    returnedAt: String
  }

  type MostBorrowedBook {
    title: String!
    author: String!
    count: Int!
  }

  type ActiveMember {
    name: String!
    email: String!
    totalBorrows: Int!
  }

  type BookAvailabilitySummary {
    totalBooks: Int!
    totalBorrowed: Int!
    availableBooks: Int!
  }

  type Query {
    # User Management
    me: User

    # Book Management
    listBooks(page: Int, limit: Int, author: String, genre: String): BookList!

    # Borrowing System
    borrowHistory: [BorrowHistory!]!

    # Reports
    mostBorrowedBooks: [MostBorrowedBook!]!
    activeMembers: [ActiveMember!]!
    bookAvailability: BookAvailabilitySummary!
  }

  type Mutation {
    # User Management
    registerUser(name: String!, email: String!, password: String!, role: String): AuthPayload!
    loginUser(email: String!, password: String!): AuthPayload!

    # Book Management (Admin only)
    addBook(title: String!, author: String!, ISBN: String!, publicationDate: String, genre: String, copies: Int): Book!
    updateBook(id: ID!, title: String, author: String, ISBN: String, publicationDate: String, genre: String, copies: Int): Book!
    deleteBook(id: ID!): String!

    # Borrowing System
    borrowBook(bookId: ID!): BorrowRecord!
    returnBook(bookId: ID!): BorrowRecord!
  }
`;

module.exports = typeDefs;
