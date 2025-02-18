# File Uploads to Cloudinary with Multer in Node.js

## 1. Installing Cloudinary and Multer

Cloudinary is a cloud-based media storage service. To upload files using Cloudinary in a Node.js Express application, install the necessary packages:

```sh
npm install cloudinary multer
```

## 2. Configuring Cloudinary

To interact with Cloudinary, import the package and configure it with your account credentials:

```javascript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});
```

### **Explanation:**

- **`cloud_name`**: Your Cloudinary account name.
- **`api_key`**: The API key from your Cloudinary dashboard.
- **`api_secret`**: The API secret key for authentication.

## 3. Configuring Multer Storage for Cloudinary

Multer is used to handle file uploads, but instead of storing files locally, we send them to Cloudinary.

```javascript
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v4 as uuidv4 } from "uuid";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const format = file.mimetype.split("/")[1]; // Extract file format dynamically
    const uniqueFilename = `${uuidv4()}-${file.originalname.split(".")[0]}`; // Combine UUID with part of the original filename
    return {
      folder: "uploads", // Folder in Cloudinary where files will be stored
      format: format, // Use original file format
      public_id: uniqueFilename, // More unique filename using UUID + original name part
    };
  },
});
```

### **Explanation of Storage Configuration:**

1. **`cloudinary`**: Uses the configured Cloudinary instance.
2. **`params.folder`**: Defines the Cloudinary folder where files will be stored.
3. **`params.format`**: Extracts the original file format dynamically.
4. **`params.public_id`**: Uses a combination of a unique ID (`uuidv4()`) and part of the original filename to ensure uniqueness.

## 4. Applying File Filters

To allow only specific file types, define a filter function before setting up Multer:

```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed."), false);
  }
};
```

### **Explanation:**

- **`allowedTypes`**: Defines the acceptable file formats.
- **`cb(null, true)`**: Accepts the file if it matches the allowed types.
- **`cb(new Error(...), false)`**: Rejects the file with an error message if the type is invalid.

## 5. Setting the Upload Function

Using the configured storage and file filter, create an upload middleware:

```javascript
const upload = multer({ storage, fileFilter });
```

## 6. Handling File Uploads in Routes

Using Multer and Cloudinary, we can create routes to handle file uploads:

### **Uploading a Single File**

```javascript
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ url: req.file.path });
});
```

### **Uploading Multiple Files**

```javascript
app.post("/upload-multiple", upload.array("files", 5), (req, res) => {
  const urls = req.files.map((file) => file.path);
  res.json({ urls });
});
```

### **Explanation:**

- `upload.single("file")` handles single file uploads.
- `upload.array("files", 5)` allows up to 5 files to be uploaded at once.
- The `req.file.path` or `req.files.map((file) => file.path)` contains the Cloudinary file URLs.

## 7. Accessing Uploaded Files in Cloudinary

Once uploaded, files can be accessed from Cloudinary’s **Media Library** or via the returned URL in `req.file.path`.

## 8. Overwriting Files with the Same `public_id`

If you upload another file with the same `public_id`, it **replaces** the existing file in Cloudinary.

```javascript
cloudinary.uploader.upload("path_to_file", { public_id: "existing_file_id" });
```

This helps maintain updated versions of files without cluttering storage.

## 9. Understanding `req.file` vs. `req.files`

### **`req.file`** (For Single File Uploads)

```json
{
  "fieldname": "file",
  "originalname": "image.png",
  "encoding": "7bit",
  "mimetype": "image/png",
  "path": "https://res.cloudinary.com/your_cloud_name/image/upload/v12345678/image.png",
  "size": 12345
}
```

### **Attributes of `req.file`:**

- `fieldname`: Form field name.
- `originalname`: Original filename.
- `encoding`: Encoding type.
- `mimetype`: File type.
- `path`: URL of the uploaded file in Cloudinary.
- `size`: File size in bytes.

### **`req.files`** (For Multiple File Uploads)

```json
[
  {
    "fieldname": "files",
    "originalname": "image1.jpg",
    "path": "https://res.cloudinary.com/your_cloud_name/image/upload/v12345678/image1.jpg"
  },
  {
    "fieldname": "files",
    "originalname": "image2.jpg",
    "path": "https://res.cloudinary.com/your_cloud_name/image/upload/v12345678/image2.jpg"
  }
]
```

### **Key Differences Between `req.file` and `req.files`:**

| Feature        | `req.file` (Single) | `req.files` (Multiple) |
| -------------- | ------------------- | ---------------------- |
| Data Type      | Object              | Array of Objects       |
| Used With      | `upload.single()`   | `upload.array()`       |
| Stores         | One file            | Multiple files         |
| Access Example | `req.file.path`     | `req.files[0].path`    |

This guide covers file uploads to Cloudinary using Multer in a Node.js Express application. 🚀

