const express = require("express")
const { createBook, getBooks, getBookById, searchBooks } = require("../controllers/bookController")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

// Public routes
router.get("/books", getBooks)
router.get("/books/:id", getBookById)
router.get("/search", searchBooks)

// Protected routes
router.post("/books", authMiddleware, createBook)

module.exports = router
