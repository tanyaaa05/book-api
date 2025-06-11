const Review = require("../models/Review")
const Book = require("../models/Book")

// @desc    Add a review to a book
// @route   POST /api/books/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const bookId = req.params.id
    const userId = req.user._id

    // Check if book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ user: userId, book: bookId })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this book",
      })
    }

    // Create review
    const review = await Review.create({
      rating,
      comment,
      user: userId,
      book: bookId,
    })

    await review.populate("user", "name email")
    await review.populate("book", "title author")

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: { review },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id
    const userId = req.user._id
    const { rating, comment } = req.body

    // Find review
    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own reviews",
      })
    }

    // Update review
    review.rating = rating || review.rating
    review.comment = comment || review.comment
    await review.save()

    await review.populate("user", "name email")
    await review.populate("book", "title author")

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: { review },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id
    const userId = req.user._id

    // Find review
    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      })
    }

    // Check if user owns the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own reviews",
      })
    }

    // Delete review
    await Review.findByIdAndDelete(reviewId)

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const reviews = await Review.find({ user: req.user._id })
      .populate("book", "title author genre")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Review.countDocuments({ user: req.user._id })

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
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
  addReview,
  updateReview,
  deleteReview,
  getMyReviews,
}
