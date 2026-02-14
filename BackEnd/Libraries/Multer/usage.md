## 📘 `usage.md` — Simple Multer Guide (Single, Multiple, and Multi-Field Uploads)

---

### 🧩 1. Setup Example Backend

```js
import express from "express";
import multer from "multer";

const app = express();
const upload = multer({ dest: "uploads/" }); // saves files to /uploads

// Single field
app.post("/upload/single", upload.single("image"), (req, res) => {
  res.json({ file: req.file });
});

// Multiple files with same field name
app.post("/upload/multiple", upload.array("photos", 5), (req, res) => {
  res.json({ files: req.files });
});

// Multiple fields (different names)
app.post(
  "/upload/mixed",
  upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  (req, res) => {
    res.json({
      imageCover: req.files["imageCover"],
      images: req.files["images"],
    });
  }
);

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
```

---

## 🧠 Key Idea — “Field Name” Must Match Everywhere

The string you pass to `upload.single()`, `upload.array()`, or inside `upload.fields()`
is the **form field name** used when uploading.

For example:

```js
upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
```

✅ means your frontend or Postman **must send**:

* one file under key `imageCover`
* up to 5 files under key `images`

If the key names don’t match, `req.files` will be empty.

---

## 🧪 2. Test in **Postman**

### 🔹 Route: `/upload/mixed`

* Method: `POST`
* Tab: **Body → form-data**

Now add:

| Key        | Type | Value             |
| ---------- | ---- | ----------------- |
| imageCover | File | (choose 1 file)   |
| images     | File | (choose 1st file) |
| images     | File | (choose 2nd file) |
| images     | File | (choose 3rd file) |

🔸 Notice:

* The **first key** `imageCover` matches `{ name: "imageCover" }`
* The **repeated keys** `images` match `{ name: "images" }`

Then click **Send** → you’ll get:

```json
{
  "imageCover": [ { "originalname": "cover.jpg", ... } ],
  "images": [
    { "originalname": "1.jpg", ... },
    { "originalname": "2.jpg", ... },
    { "originalname": "3.jpg", ... }
  ]
}
```

---

## ⚛️ 3. Sending from **Axios**

### ✅ Example for `/upload/mixed`

```js
const formData = new FormData();

// must match the backend field names!
formData.append("imageCover", coverFile);
images.forEach((img) => formData.append("images", img));

await axios.post("http://localhost:4000/upload/mixed", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

### ✅ Example for `/upload/single`

```js
const formData = new FormData();
formData.append("image", file);

await axios.post("http://localhost:4000/upload/single", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

### ✅ Example for `/upload/multiple`

```js
const formData = new FormData();
files.forEach((f) => formData.append("photos", f));

await axios.post("http://localhost:4000/upload/multiple", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

---

## 🧩 Summary Table

| Type                | Backend code                                                  | Postman key(s)                           | Axios field(s)                                                         |
| ------------------- | ------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| Single              | `upload.single("image")`                                      | `image` (1 file)                         | `formData.append("image", file)`                                       |
| Multiple (same key) | `upload.array("photos", 5)`                                   | `photos` (repeat 2–5 times)              | `formData.append("photos", f)`                                         |
| Multiple fields     | `upload.fields([{ name: "imageCover" }, { name: "images" }])` | `imageCover` (1 file), `images` (repeat) | `formData.append("imageCover", cover); formData.append("images", img)` |

---

Would you like me to add one more section showing how `req.file` and `req.files` look in the backend (console output example)?
