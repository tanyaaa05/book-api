const express = require("express")
const { addReview, updateReview, deleteReview, getMyReviews } = require("../controllers/reviewController")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

// All review routes require authentication
router.use(authMiddleware)

router.post("/books/:id/reviews", addReview)
router.put("/reviews/:id", updateReview)
router.delete("/reviews/:id", deleteReview)
router.get("/reviews/my-reviews", getMyReviews)

module.exports = router
