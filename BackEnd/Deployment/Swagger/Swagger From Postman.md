# Generating Swagger Documentation from Postman Collections

Instead of writing Swagger documentation manually for your API routes, you can use Postman to generate it automatically. This approach saves time and ensures that your documentation is consistent with the actual API behavior.

---

## **Steps to Generate Swagger Documentation from Postman**

### **Step 1: Create and Export Postman Collection**

1. **Create a Collection**: In Postman, create a collection containing all your API routes.
2. **Add Request Details**:
   - Include request method (GET, POST, PUT, DELETE, etc.).
   - Specify request headers, body, and parameters.
3. **Export the Collection**:
   - Click on the collection name.
   - Click on the three-dot menu (`...`) and select **Export**.
   - Choose **Collection v2.1** format.
   - Save the exported collection as a `.json` file.

---

### **Step 2: Convert Postman Collection to Swagger (OpenAPI) Format get the swagger.yaml file**

You can use online tools or libraries to convert the Postman collection to Swagger (OpenAPI) format.

#### **Option 1: Use an Online Converter**

1. Go to [APITransform](https://www.apitransform.com/).
2. Upload your Postman collection `.json` file.
3. Select **Convert to OpenAPI 3.0**.
4. Download the generated Swagger (OpenAPI) documentation.
5. Apply swagger.yaml in code : create .yaml file and paste the openAPI transformation to .json

#### **Option 2: Use `postman-to-openapi` NPM Package**

Alternatively, you can use the `postman-to-openapi` package to perform the conversion locally.

1. **Install the package**:

   ```bash
   npm install -g postman-to-openapi
   ```

2. **Run the conversion**:
   ```bash
   p2o /path/to/your-postman-collection.json -f /path/to/output-swagger.yaml
   ```
   This will generate a Swagger (OpenAPI) file in YAML format.

---

### **Step 3: Serve Swagger Documentation in Express**

Once you have the generated Swagger (OpenAPI) file, you can serve it using `swagger-ui-express` in your Express application.

1. **Install Required Packages**:

   ```bash
   npm install swagger-ui-express yamljs
   ```

2. **Set Up Swagger UI in Your Express App**:

   ```javascript
   const express = require("express");
   const swaggerUI = require("swagger-ui-express");
   const YAML = require("yamljs");

   const app = express();
   const swaggerDocument = YAML.load("/path/to/output-swagger.yaml");

   app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   ```

Now, you can access the Swagger documentation at `http://localhost:5000/api-docs`.

---

### **Step 4: Keep Your Documentation Updated**

To ensure your Swagger documentation remains up-to-date:

- Regularly update your Postman collection as you add new routes or modify existing ones.
- Re-export the collection and convert it to Swagger format using the above steps.

---

## **Summary**

By following these steps, you can automate the process of generating Swagger documentation from your Postman collections. This method saves time, reduces errors, and ensures that your documentation is always in sync with your API.

### **References**

- [Postman Documentation](https://learning.postman.com/docs/)
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)
- [Postman-to-OpenAPI NPM Package](https://www.npmjs.com/package/postman-to-openapi)
