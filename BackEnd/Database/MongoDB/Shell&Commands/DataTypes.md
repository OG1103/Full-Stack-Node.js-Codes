# Data Types that MongoDB Stores

1. **String**  
   - Stores textual data.  
   - In MongoDB, strings must be UTF-8 encoded.  
   - Example:  
     ```json
     "name": "John"
     ```

2. **Number**  
   - `int32`: 32-bit integer.  
   - `int64`: 64-bit integer (used when larger values are needed).  
   - `double`: Floating-point numbers.

3. **Boolean**  
   - Stores `true` or `false` values.

4. **Object (Embedded Document)**  
   - Stores embedded documents (i.e., objects within objects).

5. **Array**  
   - Stores a list of values in a single field.

6. **ObjectId**  
   - A 12-byte unique identifier that MongoDB automatically assigns to each document.  
   - Example:  
     ```json
     "_id": ObjectId("507f1f77bcf86cd799439011")
     ```

7. **Date**  
   - Stores the date and time.

8. **Timestamp**  
   - Special internal MongoDB timestamp, mostly used for replication and internal processes.
