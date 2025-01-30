
# Understanding package.json and Its Role

## 1. Project Metadata:
The `package.json` file contains essential information about the project, such as its name, version, author, license, and description. 
This metadata helps identify the project and provides context to developers and users.

## 2. Dependency Management:
It lists all the dependencies (libraries and packages) required for the project to run. 
Each dependency is specified with its version, allowing npm (Node Package Manager) to install the exact versions needed when someone sets up the project (`npm install`).

## 3. Scripts:
The `package.json` allows you to define custom scripts that can be run using npm. For example, you can create scripts to start the server, run tests, or build the application.

## 4. Version Control:
It helps manage versioning of the project itself and its dependencies. 
The versioning system follows semantic versioning (semver), which helps indicate changes and updates in a structured way.

## 5. Easy Installation:
When someone clones or pulls the project, they can simply run `npm install` to automatically install all required dependencies listed in `package.json`, 
along with the exact versions specified in `package-lock.json`. This makes it easy to set up the project in a new environment.

### NOTE:
- They are auto-created using commands (check the readme file).
- When installing any package, it is added to the `package-lock.json` file and then adds the dependency to the `package.json` file.
  - `npm install`: Installs dependencies; does not run scripts.
  - `npm run <script-name>`: Executes the specified script defined in the scripts section.
