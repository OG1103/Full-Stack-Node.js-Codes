
// Example using the 'path' module
import path from 'path'

const filePath = path.join(__dirname, 'example', 'file.txt'); // Joins path segments
console.log('Joined Path:', filePath);

console.log('Base Name:', path.basename(filePath)); // Returns the last part of the path
console.log('Extension:', path.extname(filePath)); // Returns the file extension
console.log('Absolute Path:', path.resolve('example', 'file.txt')); // Resolves to an absolute path
