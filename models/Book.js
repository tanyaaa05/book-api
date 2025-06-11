const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
      enum: {
        values: [
          "Fiction",
          "Non-Fiction",
          "Mystery",
          "Romance",
          "Sci-Fi",
          "Fantasy",
          "Biography",
          "History",
          "Self-Help",
          "Other",
        ],
        message: "Please select a valid genre",
      },
    },
    description: {
      type: String,
      required: [true, "Book description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    publishedYear: {
      type: Number,
      min: [1000, "Published year must be valid"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^(?:\d{9}[\dX]|\d{13})$/, "Please enter a valid ISBN"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for average rating
bookSchema.virtual("averageRating").get(function () {
  return this._averageRating || 0
})

// Virtual for review count
bookSchema.virtual("reviewCount").get(function () {
  return this._reviewCount || 0
})

// Index for search functionality
bookSchema.index({ title: "text", author: "text" })
bookSchema.index({ genre: 1 })
bookSchema.index({ author: 1 })

module.exports = mongoose.model("Book", bookSchema)
