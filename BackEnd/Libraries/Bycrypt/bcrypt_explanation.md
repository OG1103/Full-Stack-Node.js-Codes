
# Understanding bcrypt in Node.js

`bcrypt` is a popular library in Node.js used for securely hashing and comparing passwords. It ensures password security by adding randomness (salting) and multiple rounds of hashing, making it resistant to brute-force and rainbow table attacks.

---

## Key Features of bcrypt

1. **Salting**:  
   bcrypt generates a unique salt for each password before hashing it, ensuring that even if two users have the same password, their hashes will be different.

2. **Hashing Rounds**:  
   The cost factor (number of rounds) determines the computational effort required to hash the password. A higher number of rounds increases security but also increases the time to hash the password.

3. **Comparison**:  
   bcrypt provides methods to compare a plaintext password with a previously hashed password, enabling secure authentication.

---

## Methods in bcrypt

1. **`bcrypt.hash(password, saltRounds)`**:  
   Asynchronously generates a hash of the password with the specified number of salt rounds.

2. **`bcrypt.hashSync(password, saltRounds)`**:  
   Synchronously generates a hash of the password.

3. **`bcrypt.compare(password, hash)`**:  
   Asynchronously compares a plaintext password with a hash and returns a boolean indicating whether they match.

4. **`bcrypt.compareSync(password, hash)`**:  
   Synchronously compares a plaintext password with a hash.

5. **`bcrypt.genSalt(saltRounds)`**:  
   Asynchronously generates a salt.

6. **`bcrypt.genSaltSync(saltRounds)`**:  
   Synchronously generates a salt.

---

## Example Scenarios

1. **Hashing a password before storing it in a database.**  
2. **Comparing a user-provided password during login with the stored hash.**  
3. **Increasing the cost factor to enhance security over time.**

---

## References
- [bcrypt on npm](https://www.npmjs.com/package/bcrypt)
- [bcrypt GitHub Repository](https://github.com/kelektiv/node.bcrypt.js)
