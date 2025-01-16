# File Validations in Multer

When handling file uploads with Multer in Express, you can apply various validations to ensure that only acceptable files are uploaded. These validations include checking file types, file sizes, and more.

This guide explains the different validations you can apply in Multer and how to implement them.

---

## 1. File Type Validation

File type validation ensures that only files with specific MIME types (e.g., `image/jpeg`, `application/pdf`) are uploaded.

### Implementation

Use the `fileFilter` option to validate the file type.

#### Example

```javascript
import multer from "multer";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF files are allowed."), false); // Reject file
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
});

export const uploadFile = upload.single("file");
```

---

## 2. File Size Validation

File size validation ensures that uploaded files do not exceed a specified limit.

### Implementation

Use the `limits` option in Multer.

#### Example

```javascript
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

export const uploadFile = upload.single("file");
```

- The `fileSize` value is in bytes.
- For example, `2 * 1024 * 1024` equals 2MB.

---

## 3. Combine File Type and Size Validation

You can combine `fileFilter` and `limits` to apply both file type and size validations.

#### Example

```javascript
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const uploadFile = upload.single("file");
```

---

## 4. Validating File Count + Size For Each File

When using `upload.array()` for multiple file uploads, you can limit the number of files uploaded.

#### Example

```javascript
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    files: 5, // Limit to 5 files
  },
});

export const uploadFiles = upload.array("files", 5); // Maximum of 5 files
```

---

## 5. Dynamic Validations Based on Request Data

You can implement dynamic validations by customizing the `fileFilter` or handling logic in your controller.

#### Example

```javascript
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = req.body.allowedTypes || ["image/jpeg", "image/png"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export const uploadFile = upload.single("file");
```

---

## 6. Handling Validation Errors

When a file fails validation, Multer passes the error to the next middleware. You can handle these errors with an error-handling middleware.

#### Example

```javascript
app.post("/upload", uploadFile, (req, res, next) => {
  res.json({ message: "File uploaded successfully!" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});
```

---

## Summary of Validations

| **Validation**        | **How to Implement**                                  | **Example Option**                       |
| --------------------- | ----------------------------------------------------- | ---------------------------------------- |
| File Type Validation  | Use `fileFilter` to check MIME types.                 | `fileFilter: (req, file, cb) => { ... }` |
| File Size Validation  | Use `limits.fileSize` to restrict file size.          | `limits: { fileSize: 2 * 1024 * 1024 }`  |
| File Count Validation | Use `limits.files` or pass a limit to `upload.array`. | `limits: { files: 5 }`                   |
| Dynamic Validation    | Customize `fileFilter` based on `req.body` data.      | `fileFilter: (req, file, cb) => { ... }` |

By applying these validations, you can ensure robust and secure file upload handling in your application.
