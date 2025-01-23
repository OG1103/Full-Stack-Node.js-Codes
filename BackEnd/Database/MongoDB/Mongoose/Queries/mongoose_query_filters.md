
# Mongoose Query Filters

Mongoose provides various query filters to retrieve specific documents from a collection based on certain criteria.

---

## 1. Basic Query Filters

### 1.1 Equality (`$eq`)

Filters documents where the value of the field is equal to the specified value.

**Example**:
```javascript
const users = await User.find({ age: { $eq: 25 } });
```

### 1.2 Inequality (`$ne`)

Filters documents where the value of the field is **not equal** to the specified value.

**Example**:
```javascript
const users = await User.find({ age: { $ne: 25 } });
```

### 1.3 Greater Than (`$gt`)

Filters documents where the value of the field is **greater than** the specified value.

**Example**:
```javascript
const users = await User.find({ age: { $gt: 18 } });
```

### 1.4 Greater Than or Equal (`$gte`)

Filters documents where the value of the field is **greater than or equal to** the specified value.

**Example**:
```javascript
const users = await User.find({ age: { $gte: 18 } });
```

### 1.5 Less Than (`$lt`)

Filters documents where the value of the field is **less than** the specified value.

**Example**:
```javascript
const users = await User.find({ age: { $lt: 18 } });
```

### 1.6 Less Than or Equal (`$lte`)

Filters documents where the value of the field is **less than or equal to** the specified value.

**Example**:
```javascript
const users = await User.find({ age: { $lte: 18 } });
```

---

## 2. Logical Query Filters

### 2.1 `$and`

Filters documents that match **all** the specified conditions.

**Example**:
```javascript
const users = await User.find({ $and: [{ age: { $gte: 18 } }, { isActive: true }] });
```

### 2.2 `$or`

Filters documents that match **any** of the specified conditions.

**Example**:
```javascript
const users = await User.find({ $or: [{ age: { $lt: 18 } }, { isActive: false }] });
```

### 2.3 `$not`

Filters documents that **do not** match the specified condition.

**Example**:
```javascript
const users = await User.find({ age: { $not: { $gte: 18 } } });
```

### 2.4 `$nor`

Filters documents that **do not match any** of the specified conditions.

**Example**:
```javascript
const users = await User.find({ $nor: [{ age: { $lt: 18 } }, { isActive: true }] });
```

---

## 3. Element Query Filters

### 3.1 `$exists`

Filters documents where the field **exists** or **does not exist**.

**Example**:
```javascript
const users = await User.find({ email: { $exists: true } }); // Find users with an email field
```

### 3.2 `$type`

Filters documents where the field is of a specific BSON type.

**Example**:
```javascript
const users = await User.find({ age: { $type: "number" } });
```

---

## 4. Array Query Filters

### 4.1 `$in`

Filters documents where the field value is **in** the specified array.

**Example**:
```javascript
const users = await User.find({ age: { $in: [18, 25, 30] } });
```

### 4.2 `$nin`

Filters documents where the field value is **not in** the specified array.

**Example**:
```javascript
const users = await User.find({ age: { $nin: [18, 25, 30] } });
```

### 4.3 `$all`

Filters documents where the array field contains **all** the specified elements.

**Example**:
```javascript
const users = await User.find({ tags: { $all: ["student", "developer"] } });
```

### 4.4 `$size`

Filters documents where the array field has the specified **size**.

**Example**:
```javascript
const users = await User.find({ tags: { $size: 3 } });
```

### 4.5 `$elemMatch`

Filters documents where at least one element in the array matches the specified condition.

**Example**:
```javascript
const users = await User.find({ scores: { $elemMatch: { score: { $gte: 90 } } } });
```

---

## 5. Evaluation Query Filters

### 5.1 `$regex`

Filters documents where the field value matches the specified **regular expression**.

**Example**:
```javascript
const users = await User.find({ name: { $regex: /^John/, $options: "i" } }); // Case-insensitive regex
```

### 5.2 `$where`

Filters documents using a **JavaScript expression**.

**Example**:
```javascript
const users = await User.find({ $where: "this.age > 18" });
```

---

## 6. Geospatial Query Filters

### 6.1 `$geoWithin`

Filters documents within a specified geometry.

**Example**:
```javascript
const places = await Place.find({
  location: {
    $geoWithin: {
      $centerSphere: [[-73.97, 40.77], 10 / 3963.2], // 10 miles radius
    },
  },
});
```

### 6.2 `$near`

Filters documents that are near a specified point.

**Example**:
```javascript
const places = await Place.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [-73.97, 40.77] },
      $maxDistance: 5000, // 5 kilometers
    },
  },
});
```

---

## 7. Bitwise Query Filters

### 7.1 `$bitsAllSet`

Filters documents where all specified bit positions are set.

**Example**:
```javascript
const items = await Item.find({ flags: { $bitsAllSet: [1, 3] } });
```

### 7.2 `$bitsAnySet`

Filters documents where any of the specified bit positions are set.

**Example**:
```javascript
const items = await Item.find({ flags: { $bitsAnySet: [1, 3] } });
```

---

## Conclusion

Mongoose query filters provide a powerful way to retrieve specific documents from a collection based on complex criteria. By combining different filters, you can build advanced queries to handle a wide range of use cases.
