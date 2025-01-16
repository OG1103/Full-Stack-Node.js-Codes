
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.js";

dotenv.config();
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic Pagination Route
app.get("/api/v1/products", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find().skip(skip).limit(limitNumber);
    const totalDocuments = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limitNumber);

    res.status(200).json({
      status: "success",
      totalDocuments,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
