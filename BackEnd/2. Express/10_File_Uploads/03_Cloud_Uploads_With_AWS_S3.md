# Cloud Uploads with AWS S3

Instead of storing files locally or on Cloudinary, you can upload them to **Amazon S3** — AWS's object storage service. The approach here uses **streams**: Multer saves the file to disk, then a read stream pipes it directly to S3 without loading the entire file into memory first.

---

## 1. Installation

```bash
npm install multer @aws-sdk/client-s3 dotenv uuid
```

---

## 2. AWS Setup

### Create an S3 Bucket

1. Go to AWS Console → S3 → **Create bucket**
2. Give it a unique name (e.g., `my-app-uploads`) and pick a region
3. Uncheck "Block all public access" if files need to be publicly viewable
4. Create the bucket

### Create an IAM User

1. Go to IAM → Users → **Create user**
2. Attach the policy: `AmazonS3FullAccess`
3. Go to **Security credentials** → Create access key → "Application running outside AWS"
4. Save the **Access Key ID** and **Secret Access Key**

### Environment Variables

```
# .env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_BUCKET_NAME=my-app-uploads
```

---

## 3. Multer Config (Disk Storage)

```javascript
// middleware/multerConfig.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, PDF'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
```

---

## 4. S3 Utility — Explained Line by Line

```javascript
// utils/s3.js
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
```

**What's imported and why:**

- `S3Client` — the main connection to AWS S3. You create one instance and reuse it for all operations. It holds your credentials and region.
- `PutObjectCommand` — the command for **uploading** a file to S3 ("put" = place an object into the bucket).
- `DeleteObjectCommand` — the command for **removing** a file from S3.
- `GetObjectCommand` — the command for **retrieving** a file from S3 (used when you want to stream it back to a client, or access private files).
- `fs` — Node's built-in file system module. Used here specifically to open a **read stream** on the local temp file that Multer saved.

---

```javascript
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
```

**What this does:**

`S3Client` is your connection handle to AWS S3. You create it once at the top of the file and reuse it for every upload, delete, and get.

- `region` — tells AWS which geographic region your bucket lives in (e.g., `us-east-1`, `eu-west-1`). Requests go to that region's servers. If this doesn't match the actual bucket region, requests will fail.
- `credentials.accessKeyId` + `credentials.secretAccessKey` — these are like a username and password for your IAM user. AWS uses them to verify your server is allowed to interact with the bucket.

All three values come from `.env` — never hardcode them in your code.

---

```javascript
export const uploadToS3 = async (file, alias) => {
  const fileStream = fs.createReadStream(file.path);
```

**What `file` is:**

`file` is `req.file` from Multer — an object that looks like this after Multer saves it to disk:
```javascript
{
  fieldname: 'avatar',
  originalname: 'photo.jpg',
  mimetype: 'image/jpeg',
  path: 'uploads/3f9a1c2d-photo.jpg',  // where Multer saved it on disk
  size: 52428,
}
```

**What `alias` is:**

`alias` is the **key** — the path/name the file will have inside the S3 bucket. For example: `'avatars/user-123.jpg'`. Think of the key like a file path inside the bucket. You define what it looks like — it has no relation to the local filename Multer assigned.

**What `fs.createReadStream` does:**

`createReadStream` creates a **Readable Stream** object pointing at the file — no reading actually happens yet at this line. The file stays untouched on disk.

The reading begins only when the AWS SDK **consumes** the stream during `s3Client.send()`. As the SDK builds the HTTP PUT request to S3, it pulls data from the stream chunk by chunk, and sends each chunk over the network. So the flow is:

```
s3Client.send() starts the HTTP request
  → SDK pulls a chunk from fileStream
  → chunk goes over the network to S3
  → SDK pulls the next chunk
  → repeat until the stream is exhausted
```

Compare this to `fs.readFileSync` which loads the **entire file into a Buffer in RAM first**, and only then does the SDK send it. With a stream, the file is never fully held in memory — the SDK reads and sends simultaneously, one chunk at a time.

```javascript
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,  // which bucket to upload to
      Key: alias,                           // the name/path inside the bucket
      Body: fileStream,                     // the stream of file data
      ContentType: file.mimetype,           // tells S3 what kind of file this is
    })
  );
};
```

**Breaking down `PutObjectCommand`:**

- `Bucket` — the name of your S3 bucket. A bucket is like a top-level folder that holds all your files.
- `Key` — the file's identifier inside the bucket. This is what you store in your database to later retrieve or delete the file. Example: `'avatars/user-123.jpg'` means a folder called `avatars` with a file called `user-123.jpg` inside.
- `Body` — the actual file content. Because it's a stream, AWS SDK reads from it chunk by chunk and sends each chunk to S3 over the network.
- `ContentType` — the MIME type (e.g., `image/jpeg`, `application/pdf`). S3 stores this and uses it when serving the file — without it, browsers may not know how to display or handle the file.

**`s3Client.send(...)`** — every S3 operation follows this pattern: create a Command object (which describes what you want to do and the parameters), then hand it to the client with `.send()`. The client handles the actual HTTP request to AWS.

---

```javascript
export const getFromS3 = async (alias) => {
  return s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: alias,
    })
  );
};
```

**What this does:**

Retrieves a file from S3 by its key. This does NOT return the file's URL — it returns the **raw S3 response object**, which contains:

```javascript
{
  Body: <ReadableStream>,    // the file data as a stream
  ContentType: 'image/jpeg', // the MIME type stored when uploaded
  ContentLength: 52428,      // file size in bytes
}
```

**When you use this instead of the public URL:**

- The bucket is **private** — files have no public URL, so you need to fetch them through your server
- You want to **stream the file** back to a client (e.g., serve a download directly)

```javascript
// Example: serve a private file to the client
router.get('/files/:alias', async (req, res, next) => {
  try {
    const response = await getFromS3(req.params.alias);

    res.setHeader('Content-Type', response.ContentType);
    // response.Body is a readable stream — pipe it directly to the HTTP response
    response.Body.pipe(res);
  } catch (err) {
    next(err);
  }
});
```

`response.Body.pipe(res)` means: as data arrives from S3 in chunks, immediately forward each chunk to the HTTP response — so the client starts receiving data right away without your server buffering the whole file.

---

```javascript
export const deleteFromS3 = async (alias) => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: alias,
    })
  );
};
```

**What this does:**

Permanently removes the file at `alias` from the bucket. `DeleteObjectCommand` takes the same `Bucket` + `Key` pair that you used when uploading.

**Important:** S3 does not return an error if the key doesn't exist — it silently succeeds. If you need to confirm the file existed before deleting, check your database first.

---

## 5. Full Utility File

```javascript
// utils/s3.js
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Uploads a local file (from multer) to S3 at the given alias (key)
export const uploadToS3 = async (file, alias) => {
  const fileStream = fs.createReadStream(file.path);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: alias,
      Body: fileStream,
      ContentType: file.mimetype,
    })
  );
};

// Retrieves an object from S3 by its alias (key)
// Returns the raw S3 response ({ Body, ContentType, ContentLength })
export const getFromS3 = async (alias) => {
  return s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: alias,
    })
  );
};

// Deletes an object from S3 by its alias (key)
export const deleteFromS3 = async (alias) => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: alias,
    })
  );
};
```

---

## 6. Routes

### Upload (Single File)

```javascript
import { upload } from '../middleware/multerConfig.js';
import { uploadToS3 } from '../utils/s3.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

router.post('/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    // Build a unique key — this is what you store in your DB
    const alias = `avatars/${uuidv4()}${path.extname(req.file.originalname)}`;

    await uploadToS3(req.file, alias);

    const user = await User.findByIdAndUpdate(req.user.id, { avatar: alias }, { new: true });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});
```

### Serve / Download a File

```javascript
import { getFromS3 } from '../utils/s3.js';

router.get('/files/:alias', async (req, res, next) => {
  try {
    const response = await getFromS3(req.params.alias);
    res.setHeader('Content-Type', response.ContentType);
    response.Body.pipe(res); // stream from S3 directly to client
  } catch (err) {
    next(err);
  }
});
```

### Delete a File

```javascript
import { deleteFromS3 } from '../utils/s3.js';

router.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });

    // Delete each image from S3 using the stored alias/key
    await Promise.all(product.images.map(alias => deleteFromS3(alias)));
    await product.deleteOne();

    res.json({ message: 'Product and images deleted' });
  } catch (err) {
    next(err);
  }
});
```

---

## 7. The Upload Flow

```
1. Client sends file via multipart/form-data
2. Multer saves the file to ./uploads/ on disk → req.file.path
3. uploadToS3() opens a read stream on that local file
4. PutObjectCommand streams the data chunk by chunk to S3
5. S3 stores the file under the given Key (alias)
6. You save the alias (Key) to MongoDB — not a URL
7. To serve the file: call getFromS3(alias) and pipe Body to the response
8. To remove the file: call deleteFromS3(alias)
```

---

## 8. Alias vs URL — What to Store in MongoDB

With this pattern you store the **S3 key (alias)** in your database, not a full URL:

```javascript
// Store the key
{ avatar: 'avatars/3f9a1c2d.jpg' }

// NOT a full URL like:
{ avatar: 'https://my-bucket.s3.us-east-1.amazonaws.com/avatars/3f9a1c2d.jpg' }
```

**Why the key is better:**
- If you move buckets or regions, the key stays the same — you don't have to update every record in the DB
- Works for both public and private buckets — same key, different access method
- To get the public URL from a key: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`

---

## 9. Bucket Policy (Make Files Public)

By default S3 objects are private. To make uploaded files viewable in your app without going through your server, add this to your bucket under **Permissions → Bucket policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-app-uploads/*"
    }
  ]
}
```

If the bucket stays private, use `getFromS3` + `.pipe(res)` to serve files through your own server.

---

## 10. Summary

| Concept | What It Is |
|---------|-----------|
| `S3Client` | Your connection to AWS — holds region + credentials |
| `PutObjectCommand` | Upload a file to a bucket at a given Key |
| `GetObjectCommand` | Retrieve a file — returns a stream in `Body` |
| `DeleteObjectCommand` | Remove a file by its Key |
| `Key` (alias) | The file's path/name inside the bucket — store this in MongoDB |
| `fs.createReadStream` | Reads the local file in chunks — sends directly to S3 without buffering |
| `Body.pipe(res)` | Streams the S3 file directly to the HTTP response — no full file buffering |
