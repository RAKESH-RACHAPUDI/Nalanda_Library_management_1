# Nalanda Library Management System

A comprehensive backend system for managing a library's operations, built with Node.js, Express, MongoDB, and GraphQL. This system provides both RESTful APIs and GraphQL APIs for user management, book management, borrowing system, and reporting functionalities.

## Features

### User Management
- User registration and login
- JWT-based authentication
- Role-based access control (Admin and Member)

### Book Management (Admin Only)
- Add new books with details (title, author, ISBN, publication date, genre, copies)
- Update book information
- Delete books
- List books with pagination and filtering

### Borrowing System (Members)
- Borrow available books
- Return borrowed books
- View personal borrowing history

### Reports and Analytics
- Most borrowed books
- Active members based on borrowing history
- Book availability summary

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **GraphQL**: Apollo Server with GraphQL.js
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv

## Project Structure (MVC Architecture)

```
nalanda_backend/
├── config/
│   └── db.js                 # Database connection configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── bookController.js     # Book management logic
│   ├── borrowController.js   # Borrowing system logic
│   └── reportController.js   # Reports and analytics logic
├── graphql/
│   ├── apolloServer.js       # Apollo Server setup
│   ├── auth.js               # GraphQL authentication middleware
│   ├── index.js              # GraphQL router (legacy)
│   ├── resolvers.js          # GraphQL resolvers
│   └── schema.js             # GraphQL type definitions
├── middlewares/
│   └── authMiddleware.js     # JWT authentication middleware
├── models/
│   ├── bookModel.js          # Book schema
│   ├── borrowModel.js        # Borrowing record schema
│   └── userModel.js          # User schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── bookRoutes.js         # Book management routes
│   ├── borrowRoutes.js       # Borrowing routes
│   └── reportRoutes.js       # Report routes
├── utils/
│   └── generateToken.js      # JWT token generation utility
├── app.js                    # Express app configuration
├── server.js                 # Server startup file
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nalanda_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/nalanda_library
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

4. **Start MongoDB**
   Ensure MongoDB is running on your system or update `MONGO_URI` for cloud instance.

5. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`

## API Documentation

### RESTful APIs

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

#### Books (Admin Only)
- `POST /api/books` - Add a new book
- `GET /api/books` - List books (with pagination and filters)
- `PUT /api/books/:id` - Update book details
- `DELETE /api/books/:id` - Delete a book

#### Borrowing (Members)
- `POST /api/borrow/borrow` - Borrow a book
- `POST /api/borrow/return` - Return a borrowed book
- `GET /api/borrow/history` - Get user's borrowing history

#### Reports
- `GET /api/reports/most-borrowed` - Most borrowed books
- `GET /api/reports/active-members` - Active members
- `GET /api/reports/availability` - Book availability summary

### GraphQL API

The GraphQL API is available at `http://localhost:5000/graphql` with GraphiQL interface for testing.

#### Queries
```graphql
# Get current user info (authenticated)
query {
  me {
    _id
    name
    email
    role
  }
}

# List books with pagination and filters
query {
  listBooks(page: 1, limit: 10, author: "Author Name", genre: "Genre") {
    total
    page
    books {
      _id
      title
      author
      genre
      copies
    }
  }
}

# Get borrowing history (authenticated)
query {
  borrowHistory {
    _id
    book {
      title
      author
    }
    borrowedAt
    returnedAt
  }
}

# Reports
query {
  mostBorrowedBooks {
    title
    author
    count
  }
}

query {
  activeMembers {
    name
    email
    totalBorrows
  }
}

query {
  bookAvailability {
    totalBooks
    totalBorrowed
    availableBooks
  }
}
```

#### Mutations
```graphql
# User registration
mutation {
  registerUser(name: "John Doe", email: "john@example.com", password: "password123", role: "Member") {
    _id
    name
    email
    role
    token
  }
}

# User login
mutation {
  loginUser(email: "john@example.com", password: "password123") {
    _id
    name
    email
    role
    token
  }
}

# Add book (Admin only)
mutation {
  addBook(title: "Book Title", author: "Author Name", ISBN: "1234567890", publicationDate: "2023-01-01", genre: "Fiction", copies: 5) {
    _id
    title
    author
    ISBN
    genre
    copies
  }
}

# Update book (Admin only)
mutation {
  updateBook(id: "book_id", title: "Updated Title") {
    _id
    title
  }
}

# Delete book (Admin only)
mutation {
  deleteBook(id: "book_id")
}

# Borrow book (Member only)
mutation {
  borrowBook(bookId: "book_id") {
    _id
    book {
      title
    }
    borrowedAt
  }
}

# Return book (Member only)
mutation {
  returnBook(bookId: "book_id") {
    _id
    returnedAt
  }
}
```

## Testing

### REST API Testing
Use tools like Postman or curl to test REST endpoints. Include Authorization header for protected routes:
```
Authorization: Bearer <jwt_token>
```

### GraphQL API Testing
- Access GraphiQL at `http://localhost:5000/graphql`
- Use the interface to test queries and mutations
- Include Authorization header for authenticated operations

### Sample Test Data
1. Register an Admin user
2. Register a Member user
3. Login as Admin and add books
4. Login as Member and borrow/return books
5. Test report queries

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Access Control**: Admin and Member roles with appropriate permissions
- **Input Validation**: Proper validation for all API inputs
- **CORS Support**: Cross-origin resource sharing enabled

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


