
// Import bcrypt library
import bcrypt from 'bcrypt';

// Asynchronous example of hashing a password
const hashPasswordAsync = async (password) => {
    try {
        const saltRounds = 8; // Number of hashing rounds, recommended 8 
        const salt = await bcrypt.genSalt(saltRounds); // Generate salt
        const hash = await bcrypt.hash(password, salt); // Hash the password with the salt
        console.log('Async Hashed Password:', hash);
        return hash;
    } catch (error) {
        console.error('Error hashing password asynchronously:', error);
    }
};

// Synchronous example of hashing a password
const hashPasswordSync = (password) => {
    const saltRounds = 12;
    const salt = bcrypt.genSaltSync(saltRounds); // Generate salt synchronously
    const hash = bcrypt.hashSync(password, salt); // Hash the password with the salt and returns the hashed password
    console.log('Sync Hashed Password:', hash);
    return hash;
};

// Asynchronous example of comparing passwords
const comparePasswordsAsync = async (password, hash) => {
    try {
        const isMatch = await bcrypt.compare(password, hash); // Compare password with hash
        console.log('Async Passwords match:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords asynchronously:', error);
    }
};

// Synchronous example of comparing passwords
const comparePasswordsSync = (password, hash) => {
    const isMatch = bcrypt.compareSync(password, hash); // Compare password with hash synchronously
    console.log('Sync Passwords match:', isMatch);
    return isMatch;
};

// Testing the functions
const plainPassword = 'mySecurePassword';
const hashedPassword = hashPasswordSync(plainPassword); // Synchronous hashing

comparePasswordsSync(plainPassword, hashedPassword); // Synchronous comparison

hashPasswordAsync(plainPassword).then((asyncHash) => {
    comparePasswordsAsync(plainPassword, asyncHash); // Asynchronous comparison
});

/*
Explanation:
1. The functions `hashPasswordAsync` and `hashPasswordSync` demonstrate how to hash passwords asynchronously and synchronously.
2. The functions `comparePasswordsAsync` and `comparePasswordsSync` show how to compare plaintext passwords with hashes.
3. Salt rounds are set to 12, which provides a good balance between security and performance.
4. The test cases show both synchronous and asynchronous usage, covering real-world scenarios for login systems.
*/
