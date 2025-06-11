const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure one review per user per book
reviewSchema.index({ user: 1, book: 1 }, { unique: true })

// Index for efficient queries
reviewSchema.index({ book: 1, createdAt: -1 })
reviewSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model("Review", reviewSchema)
