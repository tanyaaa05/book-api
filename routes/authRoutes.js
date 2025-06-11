const express = require("express")
const { signup, login, getProfile } = require("../controllers/authController")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

// Public routes
router.post("/signup", signup)
router.post("/login", login)

// Protected routes
router.get("/profile", authMiddleware, getProfile)

module.exports = router
