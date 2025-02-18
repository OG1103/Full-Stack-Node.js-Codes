# File Uploads with Multer in Node.js

## 1. Installing Multer

Multer is a middleware for handling `multipart/form-data`, which is primarily used for uploading files in Express applications.

To install Multer, run:

```sh
npm install multer
```

## 2. Installing UUID for Unique Filenames

To generate unique filenames for uploaded files, install `uuid`:

```sh
npm install uuid
```

Then, import it in your file:

```javascript
import { v4 as uuidv4 } from "uuid";
```

## 3. Configuring Multer Storage

Multer provides a way to configure how files are stored on the server. Below is a **disk storage configuration** that defines:

- **Destination (\*\***`destination`\***\*)**: The folder where files will be stored.
- **Filename (\*\***`filename`\***\*)**: The name under which the file will be saved.

```javascript
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  // Define where uploaded files will be stored
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be stored in the "uploads" directory
  },

  // Define how the filename will be generated
  filename: (req, file, cb) => {
    // file.originalname retains the original filename
    cb(null, uuidv4() + "-" + file.originalname); // Generates a unique filename
  },
});
```

### **Explanation of the Storage Configuration:**

1. **`destination`**: Specifies the directory where files are stored.
2. **`filename`**: Defines a unique filename using `uuidv4()`.

## 4. Serving Uploaded Files Locally

Since file uploads are stored locally, you need to serve them using Express's `express.static` middleware. This allows the uploaded files to be accessed via HTTP.

```javascript
import express from "express";

const app = express();

// Serve files from the uploads directory
app.use("/uploads", express.static("uploads"));
```

### **Explanation:**

- `express.static("uploads")` serves the files from the `uploads` directory.
- `app.use("/uploads", express.static("uploads"))` ensures that uploaded files can be accessed via `/uploads/filename` in the browser or API responses.
- The directory path must match the storage configuration in Multer.

## 5. Adding File Filters

Multer allows filtering files based on criteria such as file type, size, and other parameters. Below is an example filter to allow only image files:

```javascript
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type"), false); // Reject the file
    // by default, any error that occurs within Multer (such as file type mismatches, size limits, or storage issues) is automatically forwarded to your global error-handling middleware in Express. Thats why doesn't need to be wrapped around async wrapper.
  }
};
```

### **Other Filter Options:**

1. **Restrict File Size:**

   ```javascript
   const upload = multer({
     storage,
     fileFilter,
     limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
   });
   ```

2. **Restrict Specific File Extensions:**

   ```javascript
   const fileFilter = (req, file, cb) => {
     const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
     if (allowedTypes.includes(file.mimetype)) {
       cb(null, true);
     } else {
       cb(new Error("Only JPEG, PNG, and GIF files are allowed"), false);
     }
   };
   ```

## 6. Creating the Upload Middleware

Using the configured storage and file filter, create an upload middleware:

```javascript
const upload = multer({ storage, fileFilter });
```

This specific `upload` middleware applies file filtering. You can create other middleware instances with different storage configurations and filters if needed.

## 7. Handling File Uploads in Routes

Multer provides different methods for handling single or multiple file uploads:

### **Uploading a Single File**

> **Note:** In any request, you must pass either `upload.single("formdatakey")` or `upload.array("formdatakey")`. The value passed here is the form data key that will be used from the frontend or Postman.

```javascript
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully");
});
```

### **Uploading Multiple Files**

> **Note:** In any request, you must pass either `upload.single("formdatakey")` or `upload.array("formdatakey")`. The value passed here is the form data key that will be used from the frontend or Postman.

```javascript
app.post("/upload-multiple", upload.array("files", 5), (req, res) => {
  res.send("Files uploaded successfully");
});
```

## 8. Understanding `req.file` vs. `req.files`

### **`req.file`\*\*** (For Single File Uploads)\*\*

```json
{
  "fieldname": "file",
  "originalname": "image.png",
  "encoding": "7bit",
  "mimetype": "image/png",
  "destination": "uploads/",
  "filename": "d3f9b3c2-1234-45a9-8f56-image.png",
  "path": "uploads/d3f9b3c2-1234-45a9-8f56-image.png",
  "size": 12345
}
```

### **Attributes of \*\***`req.file`\***\*:**

- `fieldname`: Form field name.
- `originalname`: Original filename.
- `encoding`: Encoding type.
- `mimetype`: File type.
- `destination`: Storage location.
- `filename`: Unique filename.
- `path`: Full file path.
- `size`: File size in bytes.

### **`req.files`\*\*** (For Multiple File Uploads)\*\*

```json
[
  {
    "fieldname": "files",
    "originalname": "image1.jpg",
    "filename": "abc123-image1.jpg",
    "path": "uploads/abc123-image1.jpg"
  },
  {
    "fieldname": "files",
    "originalname": "image2.jpg",
    "filename": "xyz456-image2.jpg",
    "path": "uploads/xyz456-image2.jpg"
  }
]
```

### **Explanation:**

- Unlike `req.file`, which is an object for a single file, `req.files` is an **array of objects**, each representing an uploaded file.
- Each object in `req.files` contains the same attributes as `req.file` but for different files.
- Example usage: Access the first uploaded file using `req.files[0]`.

### **Key Differences Between \*\***`req.file`\***\* and \*\***`req.files`\***\*:**

| Feature        | `req.file` (Single) | `req.files` (Multiple) |
| -------------- | ------------------- | ---------------------- |
| Data Type      | Object              | Array of Objects       |
| Used With      | `upload.single()`   | `upload.array()`       |
| Stores         | One file            | Multiple files         |
| Access Example | `req.file.path`     | `req.files[0].path`    |

This guide covers local file uploads with Multer in a Node.js Express application. 🚀
