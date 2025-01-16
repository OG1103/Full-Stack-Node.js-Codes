# File Uploads and Retrieval in Express (ES6 Syntax)

This document explains how to handle **file uploads** and retrieval in an Express application using three methods:

1. **Multer** for local storage.
2. **AWS S3** for cloud storage.
3. **Cloudinary** for cloud storage.

Each method includes detailed explanations, configurations, and examples of routes and controllers in ES6 syntax.

---

## 1. File Uploads Using Multer

### Installation

To use `multer` for handling file uploads locally, install it via npm:

```bash
npm install multer
```

### Multer Configuration for Local Storage

#### Controller Configuration

```javascript
// controllers/fileController.js
import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

// Multer instance
const upload = multer({ storage });

// Upload function
export const uploadFile = (req, res) => {
  res.json({
    filePath: `/uploads/${req.file.filename}`,
    message: "File uploaded successfully!",
  });
};

// Retrieve function
export const getFile = (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);
  res.sendFile(filePath);
};

export const uploadMiddleware = upload.single("file");
```

#### Route Configuration

```javascript
// routes/fileRoutes.js
import express from "express";
import { uploadFile, getFile, uploadMiddleware } from "../controllers/fileController.js";

const router = express.Router();

// File upload route
router.post("/upload", uploadMiddleware, uploadFile);

// File retrieval route
router.get("/uploads/:filename", getFile);

export default router;
```

### How It Works

1. **Multer Disk Storage**:

   - `destination`: Specifies the directory where files are saved.
   - `filename`: Ensures a unique filename using the current timestamp and original file name.

2. **Controller**:

   - `uploadFile`: Handles the upload and returns the file path.
   - `getFile`: Retrieves the file using its filename.

3. **Routes**:
   - `/upload`: Handles file uploads.
   - `/uploads/:filename`: Retrieves uploaded files.

---

## 2. File Uploads Using AWS S3

### Installation

Install the required packages for AWS S3:

```bash
npm install aws-sdk multer multer-s3
```

### AWS S3 Configuration

#### Controller Configuration

```javascript
// controllers/fileController.js
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Configure multer-s3 storage
const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `files/${Date.now()}-${file.originalname}`);
    },
  }),
});

// Upload function
export const uploadFileToS3 = (req, res) => {
  res.json({
    fileUrl: req.file.location,
    message: "File uploaded to S3 successfully!",
  });
};

export const uploadS3Middleware = uploadS3.single("file");
```

#### Route Configuration

```javascript
// routes/fileRoutes.js
import express from "express";
import { uploadFileToS3, uploadS3Middleware } from "../controllers/fileController.js";

const router = express.Router();

// File upload route
router.post("/upload", uploadS3Middleware, uploadFileToS3);

export default router;
```

### How It Works

1. **AWS S3 Configuration**:

   - `accessKeyId`, `secretAccessKey`, and `region` are required for authentication.
   - `bucket`: Specifies the S3 bucket where files are stored.

2. **Controller**:

   - `uploadFileToS3`: Handles file uploads to S3 and returns the file URL.

3. **Route**:

   - `/upload`: Handles file uploads to AWS S3.

4. **Retrieval**:
   - Files uploaded to S3 are accessed via their public URL (`req.file.location`).

---

## 3. File Uploads Using Cloudinary

### Installation

To use Cloudinary for file uploads, install the following packages:

```bash
npm install cloudinary multer-storage-cloudinary multer
```

### Cloudinary Configuration

#### Controller Configuration

```javascript
// controllers/fileController.js
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
    folder: "files",
    format: async (req, file) => "auto", // Automatically determine file format
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

const upload = multer({ storage });

// Upload function
export const uploadFileToCloudinary = (req, res) => {
  res.json({
    fileUrl: req.file.path, // Public URL of the uploaded file
    message: "File uploaded to Cloudinary successfully!",
  });
};

export const uploadCloudinaryMiddleware = upload.single("file");
```

#### Route Configuration

```javascript
// routes/fileRoutes.js
import express from "express";
import { uploadFileToCloudinary, uploadCloudinaryMiddleware } from "../controllers/fileController.js";

const router = express.Router();

// File upload route
router.post("/upload", uploadCloudinaryMiddleware, uploadFileToCloudinary);

export default router;
```

### How It Works

1. **Cloudinary Configuration**:

   - `cloud_name`, `api_key`, and `api_secret` are required for authentication.
   - `folder`: Specifies the folder in Cloudinary where files are saved.
   - `format`: Automatically determines the file format.

2. **Controller**:

   - `uploadFileToCloudinary`: Handles file uploads to Cloudinary and returns the file URL.

3. **Route**:

   - `/upload`: Handles file uploads to Cloudinary.

4. **Retrieval**:
   - Files uploaded to Cloudinary are accessed via their public URLs (`req.file.path`).

---

# Summary

| Method            | Storage                    | Retrieval                          |
| ----------------- | -------------------------- | ---------------------------------- |
| **Local Storage** | Saved in `uploads/` folder | Retrieved via `/uploads/:filename` |
| **AWS S3**        | Uploaded to S3 bucket      | Public URL provided by S3          |
| **Cloudinary**    | Uploaded to Cloudinary     | Public URL provided by Cloudinary  |
