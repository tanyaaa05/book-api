const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const User = require("../models/User")
const Book = require("../models/Book")
const Review = require("../models/Review")

// Load environment variables
dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ MongoDB Connected for seeding")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    console.log("🌱 Starting database seeding...")

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    await Review.deleteMany({})
    await Book.deleteMany({})
    await User.deleteMany({})

    // Create demo users
    console.log("👥 Creating demo users...")
    const hashedPassword = await bcrypt.hash("123456", 12)

    const users = await User.create([
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: hashedPassword,
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        password: hashedPassword,
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: hashedPassword,
      },
    ])

    console.log(`✅ Created ${users.length} users`)

    // Create demo books
    console.log("📚 Creating demo books...")
    const books = await Book.create([
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: "Fiction",
        description:
          "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
        publishedYear: 2020,
        isbn: "9780525559474",
        createdBy: users[0]._id,
      },
      {
        title: "Dune",
        author: "Frank Herbert",
        genre: "Sci-Fi",
        description:
          "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
        publishedYear: 1965,
        isbn: "9780441172719",
        createdBy: users[1]._id,
      },
      {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        genre: "Fantasy",
        description:
          "The riveting first-person narrative of a young man who grows to be the most notorious magician his world has ever seen.",
        publishedYear: 2007,
        isbn: "9780756404079",
        createdBy: users[0]._id,
      },
      {
        title: "Educated",
        author: "Tara Westover",
        genre: "Biography",
        description:
          "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
        publishedYear: 2018,
        isbn: "9780399590504",
        createdBy: users[2]._id,
      },
      {
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        genre: "Fiction",
        description:
          "Reclusive Hollywood icon Evelyn Hugo finally decides to tell her life story—but only to one reporter, Monique Grant.",
        publishedYear: 2017,
        isbn: "9781501161933",
        createdBy: users[1]._id,
      },
    ])

    console.log(`✅ Created ${books.length} books`)

    // Create demo reviews
    console.log("⭐ Creating demo reviews...")
    const reviews = []

    // Reviews for The Midnight Library
    reviews.push(
      {
        rating: 5,
        comment:
          "Absolutely beautiful and thought-provoking! This book made me reflect on life choices and possibilities.",
        user: users[1]._id,
        book: books[0]._id,
      },
      {
        rating: 4,
        comment: "A unique concept executed well. The philosophical elements really resonated with me.",
        user: users[2]._id,
        book: books[0]._id,
      },
    )

    // Reviews for Dune
    reviews.push(
      {
        rating: 5,
        comment: "A masterpiece of science fiction! The world-building is incredible and the story is epic.",
        user: users[0]._id,
        book: books[1]._id,
      },
      {
        rating: 4,
        comment: "Complex and rewarding read. Takes some time to get into but worth the effort.",
        user: users[2]._id,
        book: books[1]._id,
      },
    )

    // Reviews for The Name of the Wind
    reviews.push({
      rating: 5,
      comment: "Rothfuss is a master storyteller. The prose is beautiful and Kvothe is a compelling character.",
      user: users[1]._id,
      book: books[2]._id,
    })

    // Reviews for Educated
    reviews.push(
      {
        rating: 5,
        comment: "Powerful and moving memoir. Tara Westover's journey is both heartbreaking and inspiring.",
        user: users[0]._id,
        book: books[3]._id,
      },
      {
        rating: 4,
        comment: "Eye-opening account of education and family. Well-written and engaging throughout.",
        user: users[1]._id,
        book: books[3]._id,
      },
    )

    // Reviews for The Seven Husbands of Evelyn Hugo
    reviews.push(
      {
        rating: 4,
        comment: "Engaging and entertaining! Great character development and unexpected twists.",
        user: users[0]._id,
        book: books[4]._id,
      },
      {
        rating: 5,
        comment: "Couldn't put it down! Evelyn Hugo is such a fascinating character.",
        user: users[2]._id,
        book: books[4]._id,
      },
    )

    await Review.create(reviews)
    console.log(`✅ Created ${reviews.length} reviews`)

    console.log("🎉 Database seeding completed successfully!")
    console.log("\n📊 Summary:")
    console.log(`   Users: ${users.length}`)
    console.log(`   Books: ${books.length}`)
    console.log(`   Reviews: ${reviews.length}`)
    console.log("\n🔐 Demo user credentials (password: 123456):")
    console.log("   alice@example.com")
    console.log("   bob@example.com")
    console.log("   charlie@example.com")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    mongoose.connection.close()
    console.log("🔌 Database connection closed")
  }
}

// Run the seeding
const runSeed = async () => {
  await connectDB()
  await seedData()
}

runSeed()
