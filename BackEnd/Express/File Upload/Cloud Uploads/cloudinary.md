# 🚀 Cloudinary File Uploads with Multer in Node.js

This guide explains how to:

- **Set up Multer** to handle form-data and store files locally before uploading.
- **Upload files to Cloudinary** and delete them locally after successful upload.
- **Ensure efficient storage management** by automatically removing files from the local system.

---

## **📈 Step 1: Install Required Packages**

Before starting, install the necessary dependencies:

```sh
npm install express multer cloudinary dotenv fs uuid
```

---

## **📈 Step 2: Configure Multer to Handle Form Data**

Multer processes **multipart/form-data**, allowing us to extract both **text fields** and **files**.

### 🔹 **Create `multerConfig.js`**

```javascript
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";


const uploadDir = "./uploads";

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Ensure this folder exists
  }, // destination is optional
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const uniqueFilename = `${uuidv4()}-${file.originalname.split(".")[0]}${ext}`;
    cb(null, uniqueFilename);
  },
});

// ✅ Allow only images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed."), false);
  }
};

// ✅ Export Multer configuration
export const uploadDisk = multer({ storage, fileFilter });
```

---

## **📈 Step 3: Configure Cloudinary**

Cloudinary is a cloud-based media storage service. We configure it to handle file uploads.

### 🔹 **Create `cloudinaryConfig.js`**

```javascript
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export default cloudinary;
```

---

## **📈 Step 4: Create `.env` File for Credentials**

Store your Cloudinary API keys securely in a `.env` file.

### 🔹 **Create `.env` file**

```plaintext
# Cloudinary API Credentials
CLOUDINARY_CLOUD_NAME=dz5xk4l6b
CLOUDINARY_API_KEY=875524885737893
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

**⚠️ Do not commit your `.env` file to GitHub!** Add it to `.gitignore`:

```plaintext
.env
```

---

## **📈 Step 5: Upload File to Cloudinary and Delete Local File**

Once a file is uploaded to Cloudinary, **we delete it from local storage** using `fs.unlink()`.

### 🔹 **Create `uploadController.js`**

```javascript
import cloudinary from "../config/cloudinaryConfig.js";
import { BadRequestError } from "../../Errors/index.js";
import fs from "fs";

export const uploadToCloudinary = async (req) => {
  let files = [];
  try {
    // Handle both single and multiple file uploads
    if (req.file) {
      files = [req.file]; // Convert single file to array
    } else if (req.files && req.files.length > 0) {
      files = req.files;
    } else {
      throw new NotFoundError("File(s) not found");
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: "E-Commerce" })
    );

    const results = await Promise.all(uploadPromises);

    return results.map((result) => result.secure_url);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    } else {
      throw new BadRequestError("File upload failed");
    }
  } finally {
    // Ensure all uploaded files are deleted after processing
    if (files.length > 0) {
      files.forEach((file) => {
        if (file.path) {
          fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        }
      });
    }
  }
};
```

---

## **📈 Step 6: Create an API Route for Uploads**

We will create an Express route to handle **file uploads**.

### 🔹 **Create `uploadRoutes.js`**

```javascript
import express from "express";
import { uploadDisk } from "../middlewares/multerConfig.js"; // Multer middleware
import { uploadToCloudinary } from "../controllers/uploadController.js"; // Upload controller

const router = express.Router();

// ✅ Upload file to Cloudinary
router.post("/upload", uploadDisk.single("file"), async (req, res) => {
  try {
    const url = await uploadToCloudinary(req);
    res.status(201).json({ message: "File uploaded successfully", url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## **📈 Step 7: Understanding `cloudinary.uploader.upload()`**

The `cloudinary.uploader.upload()` method **uploads a file to Cloudinary** and returns metadata about the uploaded file.

### **📌 Method Signature**

```javascript
await cloudinary.uploader.upload(file, options);
```

### **📌 Parameters**

1. **`file`** (String)

   - **Required.** The local path to the file or a **remote URL**.
   - Example: `"uploads/sample.jpg"` or `"https://example.com/image.jpg"`.

2. **`options`** (Object)
   - **Optional.** Specifies transformation settings, folder locations, and metadata.

### **📌 Common Options in `upload()`**

| Option           | Type    | Description                                                          |
| ---------------- | ------- | -------------------------------------------------------------------- |
| `folder`         | String  | Specifies the Cloudinary folder to store the file.                   |
| `public_id`      | String  | Custom identifier instead of an auto-generated name.                 |
| `resource_type`  | String  | Defaults to `"image"`. Set `"video"` or `"raw"` for different files. |
| `transformation` | Object  | Applies transformations (resize, crop, etc.).                        |
| `tags`           | Array   | Assigns tags to the uploaded file.                                   |
| `overwrite`      | Boolean | Whether to overwrite files with the same `public_id`.                |
| `use_filename`   | Boolean | Uses the original file name instead of a generated ID.               |

### **📌 Examples of `upload()` Usage**

#### **🚀 Basic Upload**

```javascript
const result = await cloudinary.uploader.upload("uploads/image.jpg", {
  folder: "E-Commerce",
});

console.log(result.secure_url); // Cloudinary file URL
```

#### **🖼️ Upload with a Custom Filename**

```javascript
const result = await cloudinary.uploader.upload("uploads/image.jpg", {
  folder: "E-Commerce",
  public_id: "custom-file-name",
  use_filename: true,
});
```

#### **🔄 Resize and Crop Before Uploading**

```javascript
const result = await cloudinary.uploader.upload("uploads/image.jpg", {
  folder: "E-Commerce",
  transformation: [{ width: 500, height: 500, crop: "fill" }],
});
```

---

Modify your `server.js` or `app.js` to use the **upload route**.

```javascript
import express from "express";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Use upload routes
app.use("/api", uploadRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

**When uploading files to the cloud using Multer, the common approach is:**

1. Upload Locally → Use Multer to temporarily store the file.
2. Upload to Cloud → Read the file from local storage and upload it to cloud storage (e.g., AWS S3, Firebase, Cloudinary).
3. Delete Local File → Remove the file from local storage after successful upload.
4. Additionally, Multer enables multipart/form-data parsing, which is required for handling file uploads in Express.
