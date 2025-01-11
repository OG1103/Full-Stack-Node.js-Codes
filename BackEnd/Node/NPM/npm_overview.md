
# Everything About NPM

## What is NPM?

**NPM (Node Package Manager)** is the default package manager for **Node.js**. It is used to manage packages (libraries, modules) that are reusable pieces of code in a Node.js application. NPM allows developers to easily share and reuse code, and it provides a command-line interface to install, update, and manage these packages.

## Key Features of NPM

1. **Package Management**: NPM allows you to install, update, and uninstall Node.js packages.
2. **Version Control**: Helps manage package versions, ensuring consistent dependencies across different environments.
3. **Dependency Management**: Automatically installs dependencies specified in a project’s `package.json` file.
4. **Publishing Packages**: Developers can publish their own packages to the NPM registry, making them available to others.

## Installing NPM

NPM is automatically installed when you install **Node.js**. You can check if NPM is installed by running:
```bash
npm --version
```

## Using NPM

### 1. Initializing a New Project

To create a new Node.js project and generate a `package.json` file, run:
```bash
npm init
```

You will be prompted to enter details about your project. Alternatively, you can use the `-y` flag to accept default values and skip the prompts:
```bash
npm init -y
```

### 2. Installing Packages

To install a package, use the `npm install` (or `npm i`) command:
this is local installation - use it only in this particular project
```bash
npm install <package-name>
```

By default, packages are installed locally (in the `node_modules` folder) and added as dependencies in `package.json`.

Example:
```bash
npm install express
```

### 3. Installing a Package Globally

Global packages are installed system-wide and can be used as CLI tools. 
Can be used in any project
Use the `-g` flag to install a package globally:
```bash
npm install -g <package-name>
```

Example:
```bash
npm install -g nodemon
```

### 4. Installing a Specific Version

To install a specific version of a package, use the `@<version>` syntax:
```bash
npm install <package-name>@<version>
```

Example:
```bash
npm install express@4.17.1
```

### 5. Updating Packages

To update a package to the latest version, use:
```bash
npm update <package-name>
```

To update all packages:
```bash
npm update
```

### 6. Uninstalling Packages

To uninstall a package, use:
```bash
npm uninstall <package-name>
```

Example:
```bash
npm uninstall express
```

### 7. Listing Installed Packages

To list all locally installed packages, use:
```bash
npm list
```

To list globally installed packages, use:
```bash
npm list -g
```

## Understanding `package.json`

The `package.json` file is a metadata file that contains information about the project and its dependencies. It is essential for managing a Node.js project.

### Key Fields in `package.json`:

1. **`name`**: The name of the project.
2. **`version`**: The version of the project.
3. **`description`**: A brief description of the project.
4. **`main`**: The entry point file of the project.
5. **`scripts`**: Scripts that can be run using `npm run <script-name>`.
6. **`dependencies`**: Lists the packages required to run the project.
7. **`devDependencies`**: Lists the packages required only for development.

Example `package.json` file:
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A sample Node.js app",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}
```

## NPM Scripts

NPM allows you to define custom scripts in the `scripts` field of `package.json`. These scripts can be run using `npm run <script-name>`.

Example:
```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

To run the `start` script:
```bash
npm start
```

To run the `dev` script:
```bash
npm run dev
```

## Semantic Versioning (SemVer)

NPM uses **Semantic Versioning** to manage package versions. A version number is represented as `major.minor.patch`.

Example: `1.4.2`

- **Major**: Introduces breaking changes.
- **Minor**: Adds new features without breaking existing ones.
- **Patch**: Fixes bugs without introducing new features.

Symbols used with versions:
- `^1.4.2`: Allows updates to `1.x.x` but not `2.x.x`.
- `~1.4.2`: Allows updates to `1.4.x` but not `1.5.x`.

## NPM Registry

The **NPM registry** is a large public database of open-source Node.js packages. By default, `npm install` fetches packages from this registry.

To publish a package to the NPM registry, use:
```bash
npm publish
```

## Summary

NPM is a powerful tool for managing Node.js packages and dependencies. It simplifies the process of sharing code, managing versions, and automating tasks in a Node.js project.

Would you like a detailed guide on how to publish your own package to NPM?
