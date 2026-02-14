# Cloud Uploads with Cloudinary

Instead of storing files locally, upload them to Cloudinary (a cloud-based media storage service). The common approach: Multer saves temporarily to disk, you upload to Cloudinary, then delete the local file.

---

## 1. Installation

```bash
npm install multer cloudinary dotenv uuid
```

---

## 2. Configure Multer (Temporary Local Storage)

```javascript
// middleware/multerConfig.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const uploadDir = './uploads';

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, PDF'), false);
  }
};

export const upload = multer({ storage, fileFilter });
```

---

## 3. Configure Cloudinary

### Create a Cloudinary Account

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your **Cloud Name**, **API Key**, and **API Secret** from the dashboard

### Environment Variables

```
# .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
```

### Configuration File

```javascript
// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export default cloudinary;
```

---

## 4. Upload Helper Function

Upload to Cloudinary and clean up the local file:

```javascript
// utils/uploadToCloudinary.js
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadSingle = async (filePath, folder = 'uploads') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return result.secure_url;
  } finally {
    // Always delete the local file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });
  }
};

export const uploadMultiple = async (files, folder = 'uploads') => {
  try {
    const uploadPromises = files.map(file =>
      cloudinary.uploader.upload(file.path, { folder })
    );
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
  } finally {
    // Clean up all local files
    files.forEach(file => {
      fs.unlink(file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    });
  }
};
```

---

## 5. Using in Routes

### Single File Upload

```javascript
import express from 'express';
import { upload } from '../middleware/multerConfig.js';
import { uploadSingle } from '../utils/uploadToCloudinary.js';

const router = express.Router();

router.post('/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const url = await uploadSingle(req.file.path, 'avatars');

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: url },
      { new: true }
    );

    res.json({ user });
  } catch (err) {
    next(err);
  }
});
```

### Multiple File Upload

```javascript
router.post('/products', upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const urls = await uploadMultiple(req.files, 'products');

    const product = await Product.create({
      ...req.body,
      images: urls,
    });

    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});
```

---

## 6. Cloudinary Upload Options

The `cloudinary.uploader.upload()` method accepts various options:

```javascript
const result = await cloudinary.uploader.upload(filePath, {
  folder: 'products',              // Cloudinary folder
  public_id: 'custom-name',       // Custom file name
  resource_type: 'image',         // 'image', 'video', or 'raw'
  transformation: [               // Resize/crop on upload
    { width: 500, height: 500, crop: 'fill' }
  ],
  tags: ['product', 'gallery'],   // Tags for organization
  overwrite: true,                 // Overwrite if same public_id exists
  use_filename: true,              // Use original filename
});
```

### Upload Result Object

```javascript
result = {
  public_id: 'products/abc123',
  version: 1234567890,
  signature: 'abcdef...',
  width: 500,
  height: 500,
  format: 'jpg',
  resource_type: 'image',
  bytes: 52428,
  url: 'http://res.cloudinary.com/...',
  secure_url: 'https://res.cloudinary.com/...', // Use this one
};
```

### Common Options

| Option | Type | Description |
|--------|------|-------------|
| `folder` | String | Cloudinary folder to store the file |
| `public_id` | String | Custom identifier for the file |
| `resource_type` | String | `'image'`, `'video'`, or `'raw'` (for PDFs, etc.) |
| `transformation` | Array | Resize, crop, watermark, etc. |
| `tags` | Array | Tags for categorization |
| `overwrite` | Boolean | Overwrite existing file with same `public_id` |

---

## 7. Deleting Files from Cloudinary

```javascript
// Delete by public_id
await cloudinary.uploader.destroy('products/abc123');

// In a controller
router.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    // Delete images from Cloudinary
    for (const imageUrl of product.images) {
      const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});
```

---

## 8. Memory Storage Alternative

Skip local files entirely using Multer's memory storage:

```javascript
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    // Upload buffer to Cloudinary using a stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
});
```

---

## 9. Complete Example

```javascript
// app.js
import express from 'express';
import dotenv from 'dotenv';
import { upload } from './middleware/multerConfig.js';
import { uploadSingle, uploadMultiple } from './utils/uploadToCloudinary.js';

dotenv.config();
const app = express();
app.use(express.json());

// Single upload
app.post('/api/upload', upload.single('file'), async (req, res, next) => {
  try {
    const url = await uploadSingle(req.file.path, 'general');
    res.status(201).json({ message: 'Uploaded', url });
  } catch (err) {
    next(err);
  }
});

// Multiple upload
app.post('/api/upload-many', upload.array('files', 5), async (req, res, next) => {
  try {
    const urls = await uploadMultiple(req.files, 'general');
    res.status(201).json({ message: 'Uploaded', urls });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT || 5000);
```

---

## 10. The Upload Flow

```
1. Client sends file via multipart/form-data
2. Multer saves file temporarily to ./uploads/
3. Your controller uploads file to Cloudinary
4. Cloudinary returns a secure URL
5. Local file is deleted (cleanup)
6. URL is saved to database and/or returned to client
```

### Summary

| Step | Tool | Purpose |
|------|------|---------|
| Parse form data | Multer | Extract files from request |
| Temporary storage | Disk or memory | Hold file during upload |
| Cloud upload | Cloudinary SDK | Upload to cloud storage |
| Cleanup | `fs.unlink()` | Remove local temp file |
| Persist | MongoDB | Save cloud URL to database |
