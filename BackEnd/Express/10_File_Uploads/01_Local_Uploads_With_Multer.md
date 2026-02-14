# Local File Uploads with Multer

Multer is the standard middleware for handling `multipart/form-data` file uploads in Express applications.

---

## 1. Installation

```bash
npm install multer uuid
```

- `multer`: Handles file upload parsing
- `uuid`: Generates unique filenames to prevent collisions

---

## 2. Configuring Storage

Multer's disk storage controls **where** files are saved and **how** they are named:

```javascript
// middleware/upload.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  // Where to save files
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  // How to name files
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
```

### Callback Pattern

Both `destination` and `filename` use a callback `cb(error, value)`:
- First argument: error (or `null` if no error)
- Second argument: the directory path or filename

---

## 3. File Filtering

Restrict which file types are accepted:

```javascript
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);  // Accept
  } else {
    cb(new Error('Only image files are allowed'), false); // Reject
  }
};
```

### Allow Specific Extensions

```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, PDF'), false);
  }
};
```

**Note:** Multer errors are automatically forwarded to your Express error-handling middleware.

---

## 4. Creating the Upload Middleware

Combine storage, filter, and limits into an upload instance:

```javascript
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

export default upload;
```

---

## 5. Serving Uploaded Files

Make the `uploads/` directory publicly accessible:

```javascript
import express from 'express';
const app = express();

// Serve files at /uploads/filename
app.use('/uploads', express.static('uploads'));
```

Now a file saved as `uploads/abc-photo.jpg` is accessible at `http://localhost:3000/uploads/abc-photo.jpg`.

---

## 6. Handling Uploads in Routes

### Single File Upload

```javascript
import upload from './middleware/upload.js';

// 'avatar' is the form field name
app.post('/api/users/avatar', upload.single('avatar'), (req, res) => {
  res.json({
    message: 'File uploaded',
    file: req.file,
  });
});
```

### Multiple Files Upload

```javascript
// 'images' is the field name, 5 is the max count
app.post('/api/products/images', upload.array('images', 5), (req, res) => {
  res.json({
    message: `${req.files.length} files uploaded`,
    files: req.files,
  });
});
```

### Multiple Fields

```javascript
app.post('/api/products',
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  (req, res) => {
    res.json({
      cover: req.files.cover,
      gallery: req.files.gallery,
    });
  }
);
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
  filename: 'a1b2c3d4-photo.jpg',
  path: 'uploads/a1b2c3d4-photo.jpg',
  size: 52428,
};
```

### req.files (Array Upload)

```javascript
req.files = [
  { fieldname: 'images', originalname: '1.jpg', path: 'uploads/abc-1.jpg', ... },
  { fieldname: 'images', originalname: '2.jpg', path: 'uploads/def-2.jpg', ... },
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

| Feature | `req.file` | `req.files` |
|---------|-----------|------------|
| Data type | Object | Array or Object |
| Used with | `upload.single()` | `upload.array()` or `upload.fields()` |
| Access | `req.file.path` | `req.files[0].path` or `req.files.cover[0].path` |

---

## 8. Saving File Paths to Database

```javascript
app.post('/api/products', upload.array('images', 5), async (req, res, next) => {
  try {
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      images: imagePaths,
    });

    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});
```

---

## 9. Complete Example

```javascript
// middleware/upload.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
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
  res.status(201).json({
    message: 'Upload successful',
    url: `/uploads/${req.file.filename}`,
  });
});

app.post('/api/upload-multiple', upload.array('files', 5), (req, res) => {
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.status(201).json({ message: 'Upload successful', urls });
});

// Error handler (catches Multer errors too)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message });
});

app.listen(3000);
```

---

## 10. Summary

| Step | What to Do |
|------|-----------|
| Install | `npm install multer uuid` |
| Configure storage | `multer.diskStorage({ destination, filename })` |
| Add file filter | Check `file.mimetype` |
| Create middleware | `multer({ storage, fileFilter, limits })` |
| Use in routes | `upload.single('field')` or `upload.array('field', max)` |
| Serve files | `app.use('/uploads', express.static('uploads'))` |
| Access uploaded files | `req.file` (single) or `req.files` (multiple) |
