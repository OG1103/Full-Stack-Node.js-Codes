# Image Uploads and Retrieval in Express (ES6 Syntax)

This document explains how to handle **image uploads** and retrieval in an Express application using three methods:

1. **Multer** for local storage.
2. **Cloudinary** for cloud storage.
3. **AWS S3** for cloud storage.

Each method includes detailed explanations, configurations, and examples of routes and controllers in ES6 syntax.

---

## 1. Image Uploads Using Multer

### Installation

To use `multer` for handling image uploads locally, install it via npm:

```bash
npm install multer
```

### Multer Configuration for Local Storage

#### Controller Configuration

```javascript
// controllers/imageController.js
import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/"); // Specify the directory for image uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

// Multer instance
const upload = multer({ storage });

// Upload function
export const uploadImage = (req, res) => {
  res.json({
    filePath: `/uploads/images/${req.file.filename}`,
    message: "Image uploaded successfully!",
  });
};

// Retrieve function
export const getImage = (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", "images", req.params.filename);
  res.sendFile(filePath);
};

export const uploadMiddleware = upload.single("image");
```

#### Route Configuration

```javascript
// routes/imageRoutes.js
import express from "express";
import { uploadImage, getImage, uploadMiddleware } from "../controllers/imageController.js";

const router = express.Router();

// Image upload route
router.post("/upload-image", uploadMiddleware, uploadImage);

// Image retrieval route
router.get("/uploads/images/:filename", getImage);

export default router;
```

### How It Works

1. **Multer Disk Storage**:

   - `destination`: Specifies the directory where images are saved.
   - `filename`: Ensures a unique filename using the current timestamp and original file name.

2. **Controller**:

   - `uploadImage`: Handles the upload and returns the file path.
   - `getImage`: Retrieves the image using its filename.

3. **Routes**:
   - `/upload-image`: Handles image uploads.
   - `/uploads/images/:filename`: Retrieves uploaded images.

---

## 2. Image Uploads Using Cloudinary

### Installation

To use Cloudinary for image uploads, install the following packages:

```bash
npm install cloudinary multer-storage-cloudinary multer
```

### Cloudinary Configuration

#### Controller Configuration

```javascript
// controllers/imageController.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images",
    format: async (req, file) => "jpg", // Force JPG format
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

// Upload function
export const uploadImageToCloudinary = (req, res) => {
  res.json({
    fileUrl: req.file.path,
    message: "Image uploaded to Cloudinary successfully!",
  });
};

export const uploadCloudinaryMiddleware = upload.single("image");
```

#### Route Configuration

```javascript
// routes/imageRoutes.js
import express from "express";
import { uploadImageToCloudinary, uploadCloudinaryMiddleware } from "../controllers/imageController.js";

const router = express.Router();

// Image upload route
router.post("/upload-image", uploadCloudinaryMiddleware, uploadImageToCloudinary);

export default router;
```

### How It Works

1. **Cloudinary Configuration**:

   - `cloud_name`, `api_key`, and `api_secret` are required for authentication.
   - `folder`: Specifies the folder in Cloudinary where images are saved.

2. **Controller**:

   - `uploadImageToCloudinary`: Handles image uploads to Cloudinary and returns the image URL.

3. **Route**:

   - `/upload-image`: Handles image uploads to Cloudinary.

4. **Retrieval**:
   - Images are accessed via their public URLs (`req.file.path`).

---

## 3. Image Uploads Using AWS S3

### Installation

To use AWS S3 for image uploads, install the following packages:

```bash
npm install aws-sdk multer multer-s3
```

### AWS S3 Configuration

#### Controller Configuration

```javascript
// controllers/imageController.js
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Configure Multer-S3 storage
const storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: "public-read",
  key: (req, file, cb) => {
    cb(null, `images/${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload function
export const uploadImageToS3 = (req, res) => {
  res.json({
    fileUrl: req.file.location, // Public URL of the uploaded image
    message: "Image uploaded to AWS S3 successfully!",
  });
};

export const uploadS3Middleware = upload.single("image");
```

#### Route Configuration

```javascript
// routes/imageRoutes.js
import express from "express";
import { uploadImageToS3, uploadS3Middleware } from "../controllers/imageController.js";

const router = express.Router();

// Image upload route
router.post("/upload-image", uploadS3Middleware, uploadImageToS3);

export default router;
```

### How It Works

1. **AWS S3 Configuration**:

   - `accessKeyId`, `secretAccessKey`, and `region` are required for authentication.
   - `bucket`: Specifies the S3 bucket where images are stored.

2. **Controller**:

   - `uploadImageToS3`: Handles image uploads to AWS S3 and returns the image URL.

3. **Route**:

   - `/upload-image`: Handles image uploads to AWS S3.

4. **Retrieval**:
   - Images uploaded to AWS S3 are accessed via their public URLs (`req.file.location`).

---

# Summary

| Method            | Storage                           | Retrieval                                 |
| ----------------- | --------------------------------- | ----------------------------------------- |
| **Local Storage** | Saved in `uploads/images/` folder | Retrieved via `/uploads/images/:filename` |
| **Cloudinary**    | Uploaded to Cloudinary            | Public URL provided by Cloudinary         |
| **AWS S3**        | Uploaded to AWS S3 bucket         | Public URL provided by AWS S3             |
