# 📚 Book Review API

A comprehensive RESTful API for managing books and reviews, built with Node.js, Express, MongoDB, and JWT authentication.

## ✨ Features

- **User Authentication**: JWT-based signup/login system
- **Book Management**: Create, read, and search books
- **Review System**: Add, update, and delete reviews (one per user per book)
- **Search Functionality**: Search books by title or author
- **Pagination**: Efficient pagination for all list endpoints
- **Rating System**: Automatic average rating calculation
- **Data Validation**: Comprehensive input validation and error handling

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv
- **Additional**: CORS, Morgan (logging)

## 📁 Project Structure

```
book-review-api/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── bookController.js     # Book management logic
│   └── reviewController.js   # Review management logic
├── middlewares/
│   ├── authMiddleware.js     # JWT authentication middleware
│   └── errorHandler.js       # Global error handling
├── models/
│   ├── User.js              # User schema
│   ├── Book.js              # Book schema
│   └── Review.js            # Review schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── bookRoutes.js        # Book routes
│   └── reviewRoutes.js      # Review routes
├── utils/
│   └── jwtUtils.js          # JWT utility functions
├── seed/
│   └── seed.js              # Database seeding script
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
├── README.md               # Project documentation
└── server.js               # Main application file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-review-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books (with pagination & filters) |
| GET | `/api/books/:id` | Get book by ID with reviews |
| POST | `/api/books` | Create new book |
| GET | `/api/search?query=...` | Search books by title/author |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-----------|
| POST | `/api/books/:id/reviews` | Add review to book |
| PUT | `/api/reviews/:id` | Update own review |
| DELETE | `/api/reviews/:id` | Delete own review |
| GET | `/api/reviews/my-reviews` | Get user's reviews |

## 📝 API Usage Examples

### Authentication

**Signup**
```bash
curl -X POST http://localhost:5000/api/auth/signup
  -H "Content-Type: application/json"
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login
  -H "Content-Type: application/json"
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Books

**Get Books with Filters**
```bash
# Get all books
curl http://localhost:5000/api/books

# With pagination
curl "http://localhost:5000/api/books?page=1&limit=5"

# Filter by genre
curl "http://localhost:5000/api/books?genre=Fiction"

# Filter by author
curl "http://localhost:5000/api/books?author=Matt Haig"
```

**Create Book**
```bash
curl -X POST http://localhost:5000/api/books
  -H "Content-Type: application/json"
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
  -d '{
    "title": "Sample Book",
    "author": "Sample Author",
    "genre": "Fiction",
    "description": "A great book about...",
    "publishedYear": 2023
  }'
```

**Search Books**
```bash
curl "http://localhost:5000/api/search?query=dune"
```

### Reviews

**Add Review**
```bash
curl -X POST http://localhost:5000/api/books/BOOK_ID/reviews
  -H "Content-Type: application/json"
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
  -d '{
    "rating": 5,
    "comment": "Excellent book! Highly recommended."
  }'
```

## 🌱 Database Seeding

The project includes a comprehensive seed script that populates the database with demo data:

- **3 Demo Users** (password: `123456`)
  - alice@example.com
  - bob@example.com
  - charlie@example.com

- **5 Demo Books** across various genres
- **Multiple Reviews** for each book

Run the seed script:
```bash
npm run seed
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Register** or **login** to receive a JWT token
2. **Include the token** in the Authorization header for protected routes:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```
3. **Token expires** in 7 days (configurable)

## 📊 Data Models

### User
- name (required, max 50 chars)
- email (required, unique, validated)
- password (required, min 6 chars, hashed)

### Book
- title (required, max 200 chars)
- author (required, max 100 chars)
- genre (required, enum values)
- description (required, max 1000 chars)
- publishedYear (optional, validated range)
- isbn (optional, unique, validated format)
- createdBy (reference to User)

### Review
- rating (required, 1-5 scale)
- comment (required, max 500 chars)
- user (reference to User)
- book (reference to Book)
- Constraint: One review per user per book

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `NODE_ENV` | Environment mode | development |

### Pagination Defaults

- Default page size: 10 items
- Maximum page size: 100 items
- Books endpoint: 10 per page
- Reviews endpoint: 5 per page

## 🛡️ Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Detailed field-level validation messages
- **Authentication Errors**: Clear JWT and authorization messages
- **Database Errors**: Handled duplicate keys, cast errors, etc.
- **404 Errors**: Resource not found messages
- **500 Errors**: Generic server error messages

## 🧪 Testing

You can test the API using:

- **Postman**: Import the endpoints and test manually
- **curl**: Use the provided curl examples
- **Frontend Application**: Build a React/Vue/Angular app
- **API Testing Tools**: Insomnia, Thunder Client, etc.

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Use a production MongoDB instance
3. Set `NODE_ENV=production`

### Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Vercel**: Serverless deployment
- **DigitalOcean**: VPS deployment
- **AWS**: EC2 or Lambda deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Happy coding! 🎉**

