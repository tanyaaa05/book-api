const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const errorHandler = require("./middlewares/errorHandler")

// Import routes
const authRoutes = require("./routes/authRoutes")
const bookRoutes = require("./routes/bookRoutes")
const reviewRoutes = require("./routes/reviewRoutes")

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api",authRoutes, bookRoutes)
app.use("/api",authRoutes, reviewRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Book Review API is running!",
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware (should be last)
app.use(errorHandler)

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 Book Review API is ready!`)
})

module.exports = app
