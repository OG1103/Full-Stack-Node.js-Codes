# Multer — File Upload Middleware

Multer is the standard middleware for handling `multipart/form-data` file uploads in Express. It parses file data from incoming requests and makes it available via `req.file` (single) or `req.files` (multiple).

---

## 1. Installation

```bash
npm install multer
```

---

## 2. How Multer Works

```
1. Client sends a request with Content-Type: multipart/form-data
2. Multer intercepts the request
3. Parses the file(s) and text fields
4. Saves files to disk (or memory buffer)
5. Populates req.file / req.files and req.body
6. Calls next() → your route handler runs
```

**Important:** Multer only processes `multipart/form-data` requests. It does nothing with JSON or URL-encoded requests.

---

## 3. Storage Configuration

### Disk Storage (Save to Filesystem)

```javascript
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
  // Where to save files
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directory must exist
  },

  // How to name files
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);  // e.g., "a1b2c3d4.jpg"
  },
});
```

### Memory Storage (Buffer in Memory)

```javascript
const storage = multer.memoryStorage();
// File available as req.file.buffer (no file saved to disk)
// Useful for cloud uploads (Cloudinary, S3) or image processing
```

---

## 4. File Filtering

Accept or reject files based on type:

```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);   // Accept
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, PDF'), false);  // Reject
  }
};
```

### Image-Only Filter

```javascript
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};
```

---

## 5. Creating the Upload Instance

Combine storage, filter, and limits:

```javascript
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB max per file
    files: 10,                    // Max 10 files per request
  },
});

export default upload;
```

### Limits Options

| Option | Description |
|--------|-------------|
| `fileSize` | Max file size in bytes |
| `files` | Max number of files |
| `fields` | Max number of non-file fields |
| `fieldSize` | Max size of field value |
| `fieldNameSize` | Max field name length |

---

## 6. Upload Methods

### Single File — `upload.single('fieldName')`

```javascript
// Client sends one file with field name "avatar"
app.post('/api/avatar', upload.single('avatar'), (req, res) => {
  console.log(req.file);  // Single file object
  console.log(req.body);  // Text fields
  res.json({ url: `/uploads/${req.file.filename}` });
});
```

### Multiple Files (Same Field) — `upload.array('fieldName', maxCount)`

```javascript
// Client sends up to 5 files with field name "images"
app.post('/api/gallery', upload.array('images', 5), (req, res) => {
  console.log(req.files);  // Array of file objects
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});
```

### Multiple Fields — `upload.fields([])`

```javascript
// Client sends files with different field names
app.post('/api/product', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]), (req, res) => {
  console.log(req.files.cover);    // Array (1 file)
  console.log(req.files.gallery);  // Array (up to 10 files)
  res.json({ cover: req.files.cover, gallery: req.files.gallery });
});
```

### No Files — `upload.none()`

```javascript
// Only parse text fields from multipart/form-data
app.post('/api/data', upload.none(), (req, res) => {
  console.log(req.body);  // Text fields only
  res.json({ data: req.body });
});
```

---

## 7. req.file vs req.files

### req.file (Single Upload)

```javascript
req.file = {
  fieldname: 'avatar',
  originalname: 'photo.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'uploads/',
  filename: 'a1b2c3d4.jpg',
  path: 'uploads/a1b2c3d4.jpg',
  size: 52428,
};
```

### req.files (Array Upload)

```javascript
req.files = [
  { fieldname: 'images', originalname: '1.jpg', filename: 'abc.jpg', ... },
  { fieldname: 'images', originalname: '2.jpg', filename: 'def.jpg', ... },
];
```

### req.files (Fields Upload)

```javascript
req.files = {
  cover: [{ fieldname: 'cover', originalname: 'cover.jpg', ... }],
  gallery: [
    { fieldname: 'gallery', originalname: '1.jpg', ... },
    { fieldname: 'gallery', originalname: '2.jpg', ... },
  ],
};
```

---

## 8. Serving Uploaded Files

Make the uploads directory publicly accessible:

```javascript
import express from 'express';
const app = express();

app.use('/uploads', express.static('uploads'));
// File at uploads/a1b2c3d4.jpg → http://localhost:3000/uploads/a1b2c3d4.jpg
```

---

## 9. Error Handling

Multer errors (file too large, wrong type, too many files) can be caught in error middleware:

```javascript
import multer from 'multer';

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific error
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    // Custom errors (from fileFilter)
    return res.status(400).json({ error: err.message });
  }

  next();
});
```

### MulterError Codes

| Code | Cause |
|------|-------|
| `LIMIT_FILE_SIZE` | File exceeds `fileSize` limit |
| `LIMIT_FILE_COUNT` | Too many files |
| `LIMIT_FIELD_KEY` | Field name too long |
| `LIMIT_FIELD_VALUE` | Field value too long |
| `LIMIT_FIELD_COUNT` | Too many fields |
| `LIMIT_UNEXPECTED_FILE` | Field name doesn't match |

---

## 10. Validation After Upload

Multer saves the file **before** your handler runs. If validation fails, you need to delete the file:

```javascript
import fs from 'fs';

app.post('/api/products', upload.single('image'), async (req, res, next) => {
  try {
    // Validate other fields
    if (!req.body.name || !req.body.price) {
      // Delete the uploaded file since validation failed
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({ product });
  } catch (err) {
    // Clean up file on any error
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    next(err);
  }
});
```

---

## 11. Sending Files from the Client

### Using Postman

1. Set request method to POST
2. In the Body tab, select **form-data**
3. Add a key with type **File** and select a file
4. Add text fields as regular key-value pairs

### Using Axios (JavaScript)

```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);  // File
formData.append('name', 'John');                 // Text field

const response = await axios.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

### Using Fetch

```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,  // Don't set Content-Type — browser does it automatically
});
```

---

## 12. Complete Example

```javascript
// middleware/upload.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed'), false);
  }
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
```

```javascript
// app.js
import express from 'express';
import upload from './middleware/upload.js';

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.post('/api/upload-many', upload.array('files', 5), (req, res) => {
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.status(201).json({ urls });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message });
});

app.listen(3000);
```

---

## 13. Summary

| Feature | Method |
|---------|--------|
| Single file | `upload.single('fieldName')` |
| Multiple files (one field) | `upload.array('fieldName', max)` |
| Multiple fields | `upload.fields([{ name, maxCount }])` |
| Text only (multipart) | `upload.none()` |
| File info | `req.file` (single) / `req.files` (multiple) |
| Disk storage | `multer.diskStorage({ destination, filename })` |
| Memory storage | `multer.memoryStorage()` |
| Serve files | `app.use('/uploads', express.static('uploads'))` |
