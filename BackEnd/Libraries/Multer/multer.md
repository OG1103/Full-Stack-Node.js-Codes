# Multer Overview

## What is Multer?
Multer is a middleware for handling `multipart/form-data`, which is primarily used for file uploads in Node.js applications. It integrates with Express.js and allows for efficient file handling.

## Why Use Multer?
- **Processes `multipart/form-data`** (which is required for file uploads).
- **Handles file uploads** efficiently in Express applications.
- **Stores files** in disk (local storage), memory, or cloud.
- **Adds uploaded files to the request (`req.file` or `req.files`)** for easy access.
- **Supports single and multiple file uploads.**
- **Allows file validation** (size, type, etc.).

## Installation
To install Multer, run:
```bash
npm install multer
```

## How Multer Works
1. **Parses `multipart/form-data`** to handle both text fields and file uploads.
2. **Stores files** in disk, memory, or uploads to a cloud provider.
3. **Adds uploaded files to `req.file` or `req.files`** for further processing.

## Basic Example: Uploading a File
```javascript
const express = require('express');
const multer = require('multer');

const app = express();

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Store files in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Handle single file upload
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.body); // Form fields
    console.log(req.file); // Uploaded file details
    res.send({ message: 'File uploaded successfully!', file: req.file, fields: req.body });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### What Happens Here?
- `upload.single('image')` → Uploads **one** file.
- `req.file` → Contains uploaded file details.
- `req.body` → Contains form fields.

## Uploading Multiple Files
```javascript
app.post('/uploads', upload.array('files', 5), (req, res) => {
    res.send({ message: 'Files uploaded!', files: req.files });
});
```
- `upload.array('files', 5)` → Allows up to 5 files.

## Uploading Multiple Fields (Cover & Images)
```javascript
app.post('/upload-files', upload.fields([
    { name: 'cover', maxCount: 1 },  // Single file for "cover"
    { name: 'images', maxCount: 5 }  // Up to 5 files for "images"
]), (req, res) => {
    console.log(req.body);  // Form fields
    console.log(req.files); // Uploaded files (cover + images)

    res.send({
        message: 'Files uploaded successfully!',
        cover: req.files['cover'] ? req.files['cover'][0] : null,
        images: req.files['images'] || [],
        fields: req.body
    });
});
```
- `upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'images', maxCount: 5 }])` → Handles multiple file fields.
- `req.files['cover'][0]` → Retrieves **single cover file**.
- `req.files['images']` → Retrieves **array of images**.
- `req.body` contains form fields.

## Uploading to Memory Instead of Disk
```javascript
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file.buffer); // File data in memory
    res.send('File uploaded but not saved.');
});
```
- The file is stored **in memory (RAM)** instead of a folder.

## File Validation: Restrict Size & Type
```javascript
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Only PNG and JPEG files are allowed'), false);
        }
    }
});
```
- Limits file size to **2MB**.
- Restricts file type to **PNG & JPEG**.

## Upload to Cloud Storage (AWS S3 Example)
```javascript
const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({ /* AWS Config */ });

app.post('/upload', upload.single('image'), async (req, res) => {
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath);

    const uploadParams = {
        Bucket: 'your-bucket-name',
        Key: req.file.filename,
        Body: fileContent,
        ContentType: req.file.mimetype
    };

    try {
        const result = await s3.upload(uploadParams).promise();
        fs.unlinkSync(filePath); // Delete after upload
        res.send({ message: 'Uploaded to S3!', url: result.Location });
    } catch (error) {
        res.status(500).send({ error: 'Upload failed', details: error.message });
    }
});
```
✅ **Files are uploaded to AWS S3 and deleted from local storage.**

## Summary
- **Multer enables `multipart/form-data` processing** for file uploads.
- **Stores files on disk, in memory, or uploads to cloud storage**.
- **Attaches files to `req.file` or `req.files`**.
- **Supports file validation** (size, type, etc.).
- **Can delete local files after uploading to the cloud**.

Would you like examples for **Cloudinary or Firebase**? 🚀

