# req.file and req.files (Multer)

When handling file uploads with Multer, Express attaches file data to the request object as `req.file` (single upload) or `req.files` (multiple uploads).

---

## 1. req.file - Single File Upload

Used with `upload.single('fieldName')`. The uploaded file is available as an object:

```javascript
import express from 'express';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

app.post('/avatar', upload.single('profileImage'), (req, res) => {
  console.log(req.file);
  res.json({ file: req.file });
});
```

### Structure of req.file

```javascript
req.file = {
  fieldname: 'profileImage',     // Form field name
  originalname: 'avatar.png',    // Original filename from user's computer
  encoding: '7bit',              // File encoding
  mimetype: 'image/png',         // MIME type
  destination: './uploads/',     // Upload directory
  filename: '1684938926481-avatar.png', // Saved filename on server
  path: 'uploads/1684938926481-avatar.png', // Full path to file
  size: 102400                   // File size in bytes
};
```

---

## 2. req.files - Multiple File Uploads

### Same Field Name: upload.array()

When uploading multiple files under the same field name:

```javascript
app.post('/gallery', upload.array('images', 5), (req, res) => {
  console.log(req.files); // Array of file objects
  res.json({ count: req.files.length });
});
```

```javascript
req.files = [
  { fieldname: 'images', originalname: '1.jpg', path: 'uploads/abc-1.jpg', ... },
  { fieldname: 'images', originalname: '2.jpg', path: 'uploads/def-2.jpg', ... }
];
```

### Different Field Names: upload.fields()

When uploading files under different field names:

```javascript
app.post('/product', upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), (req, res) => {
  console.log(req.files.imageCover); // Array with 1 file
  console.log(req.files.images);     // Array with up to 5 files
});
```

```javascript
req.files = {
  imageCover: [{ fieldname: 'imageCover', originalname: 'cover.jpg', ... }],
  images: [
    { fieldname: 'images', originalname: '1.jpg', ... },
    { fieldname: 'images', originalname: '2.jpg', ... }
  ]
};
```

---

## 3. Accessing File Data in Controllers

### Single File - Save Path to Database

```javascript
app.post('/api/users/avatar', upload.single('avatar'), async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.file.path },
    { new: true }
  );
  res.json({ user });
});
```

### Multiple Files - Upload to Cloud

```javascript
import cloudinary from '../config/cloudinary.js';

app.post('/api/products', upload.array('images', 5), async (req, res) => {
  const urls = await Promise.all(
    req.files.map(file => cloudinary.uploader.upload(file.path))
  );

  const product = await Product.create({
    ...req.body,
    images: urls.map(result => result.secure_url)
  });

  res.status(201).json({ product });
});
```

---

## 4. Memory Storage (No Local Files)

Instead of writing to disk, keep files in memory as buffers:

```javascript
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file.buffer); // File data as Buffer
  // Upload buffer directly to cloud storage
});
```

With memory storage, `req.file` has a `buffer` property instead of `path`, `destination`, and `filename`.

---

## 5. Summary

| Method | Middleware | Access | Data Type |
|--------|-----------|--------|-----------|
| Single file | `upload.single('field')` | `req.file` | Object |
| Multiple files (same field) | `upload.array('field', max)` | `req.files` | Array |
| Multiple fields | `upload.fields([...])` | `req.files` | Object with arrays |

### Key Points

1. `req.file` is an **object** for a single file
2. `req.files` is an **array** with `upload.array()` or an **object** with `upload.fields()`
3. Use `req.file.path` for local file path, `req.file.buffer` for memory storage
4. Always clean up temporary files after cloud uploads using `fs.unlink()`
