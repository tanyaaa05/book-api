const Book = require("../models/Book")
const Review = require("../models/Review")

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res, next) => {
  try {
    const bookData = {
      ...req.body,
      createdBy: req.user._id,
    }

    const book = await Book.create(bookData)
    await book.populate("createdBy", "name email")

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: { book },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all books with pagination and filters
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build filter object
    const filter = {}
    if (req.query.author) {
      filter.author = new RegExp(req.query.author, "i")
    }
    if (req.query.genre) {
      filter.genre = req.query.genre
    }

    // Get books with pagination
    const books = await Book.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count for pagination
    const total = await Book.countDocuments(filter)

    // Calculate average ratings for each book
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({ book: book._id })
        const averageRating =
          reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

        const bookObj = book.toObject()
        bookObj.averageRating = Math.round(averageRating * 10) / 10
        bookObj.reviewCount = reviews.length
        return bookObj
      }),
    )

    res.status(200).json({
      success: true,
      data: {
        books: booksWithRatings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBooks: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single book by ID with reviews
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate("createdBy", "name email")

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Get reviews with pagination
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    const reviews = await Review.find({ book: req.params.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalReviews = await Review.countDocuments({ book: req.params.id })

    // Calculate average rating
    const allReviews = await Review.find({ book: req.params.id })
    const averageRating =
      allReviews.length > 0 ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length : 0

    const bookObj = book.toObject()
    bookObj.averageRating = Math.round(averageRating * 10) / 10
    bookObj.reviewCount = allReviews.length

    res.status(200).json({
      success: true,
      data: {
        book: bookObj,
        reviews,
        reviewsPagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNextPage: page < Math.ceil(totalReviews / limit),
          hasPrevPage: page > 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Search books by title or author
// @route   GET /api/search
// @access  Public
const searchBooks = async (req, res, next) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Search using regex for partial matches
    const searchFilter = {
      $or: [{ title: new RegExp(query, "i") }, { author: new RegExp(query, "i") }],
    }

    const books = await Book.find(searchFilter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Book.countDocuments(searchFilter)

    // Calculate average ratings for each book
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({ book: book._id })
        const averageRating =
          reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

        const bookObj = book.toObject()
        bookObj.averageRating = Math.round(averageRating * 10) / 10
        bookObj.reviewCount = reviews.length
        return bookObj
      }),
    )

    res.status(200).json({
      success: true,
      data: {
        books: booksWithRatings,
        searchQuery: query,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBooks: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createBook,
  getBooks,
  getBookById,
  searchBooks,
}
