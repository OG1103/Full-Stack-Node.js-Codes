// ------------------------------------
// JavaScript Regular Expressions Notes (Extended)
// ------------------------------------

// 1. Creating a Regular Expression
// Two ways to create a regex:

// a) Literal Syntax
const regexLiteral = /hello/;
// b) Constructor Function
const regexConstructor = new RegExp("hello");

// Basic Syntax:
// - Literal: `/pattern/`
// - Constructor: `new RegExp('pattern')`

// Explanation:
// - Use literal syntax when the pattern is constant.
// - Use the constructor when the pattern is dynamic (e.g., from a variable).

// 2. Testing a Pattern with .test()
// The .test() method checks if a pattern is present in a string, returning true or false.

const regex1 = /hello/;
console.log(regex1.test("hello world")); // Output: true -> 'hello' is found in the string
console.log(regex1.test("goodbye world")); // Output: false -> 'hello' is not found in the string

// Basic Syntax:
// `regex.test(string)`

// Explanation:
// - .test() returns `true` if the pattern matches and `false` if it doesn't.

// 3. Flags in Regular Expressions
// Flags modify how the regex is applied. Common flags include:
// - i : case-insensitive matching
// - g : global matching (find all matches, not just the first)
// - m : multi-line matching

const regex2 = /hello/i; // 'i' flag: case-insensitive
console.log(regex2.test("Hello world")); // Output: true -> 'Hello' matches despite the uppercase 'H'

const regex3 = /world/g; // 'g' flag: finds all occurrences
const str = "world, world!";
console.log(str.match(regex3)); // Output: ['world', 'world'] -> finds both occurrences of 'world'

// Basic Syntax:
// `/pattern/flags`

// Explanation:
// - Flags modify how the regex works.
// - `i` makes the match case-insensitive.
// - `g` makes the regex find all occurrences instead of stopping at the first match.

// 4. Basic Character Matching with []
// Character classes [] define a set of characters that can match. You can use individual characters or ranges.

const regex4 = /[aeiou]/; // Matches any vowel
console.log(regex4.test("apple")); // Output: true -> 'a' is a vowel
console.log(regex4.test("sky")); // Output: false -> no vowels

const regex5 = /[a-z]/; // Matches any lowercase letter
console.log(regex5.test("Hello")); // Output: true -> 'e' is a lowercase letter

// Basic Syntax:
// `[abc]` - matches 'a', 'b', or 'c'
// `[a-z]` - matches any lowercase letter from 'a' to 'z'

// Explanation:
// - Character classes match any character inside the brackets.
// - You can specify ranges (e.g., `[a-z]` for lowercase letters).

// 5. Negating a Character Class with [^]
// [^] is used to negate a character class, meaning it matches anything except the characters inside.

const regex6 = /[^aeiou]/; // Matches any character that is not a vowel
console.log(regex6.test("apple")); // Output: true -> 'p' is not a vowel
console.log(regex6.test("iou")); // Output: false -> all vowels

const regex7 = /[^0-9]/; // Matches any character that is not a digit
console.log(regex7.test("123abc")); // Output: true -> 'a' is not a digit

// Basic Syntax:
// `[^abc]` - matches any character except 'a', 'b', or 'c'

// Explanation:
// - Negating character classes excludes specific characters.
// - `[^aeiou]` will match any non-vowel character.

// 6. Anchors (^ and $)
// Anchors assert the position in the string:
// - ^ matches the start of the string
// - $ matches the end of the string

const regex8 = /^hello/; // Matches 'hello' only at the start
console.log(regex8.test("hello world")); // Output: true -> 'hello' is at the start
console.log(regex8.test("say hello")); // Output: false -> 'hello' is not at the start

const regex9 = /world$/; // Matches 'world' only at the end
console.log(regex9.test("hello world")); // Output: true -> 'world' is at the end
console.log(regex9.test("world says hello")); // Output: false -> 'world' is not at the end

// Basic Syntax:
// `^pattern` - matches at the start of the string
// `pattern$` - matches at the end of the string

// Explanation:
// - Anchors are used to match positions in a string rather than characters.
// - `^` ensures the pattern appears at the beginning, and `$` ensures it appears at the end.

// 7. Quantifiers (*, +, ?, {n,m})
// Quantifiers control how many times a pattern can appear.

const regex10 = /ab*c/; // Matches 'a' followed by 0 or more 'b's, then 'c'
console.log(regex10.test("ac")); // Output: true -> 0 'b's is allowed
console.log(regex10.test("abc")); // Output: true
console.log(regex10.test("abbbbbc")); // Output: true

const regex11 = /ab+c/; // Matches 'a' followed by 1 or more 'b's, then 'c'
console.log(regex11.test("ac")); // Output: false -> needs at least 1 'b'
console.log(regex11.test("abc")); // Output: true
console.log(regex11.test("abbbbbc")); // Output: true

const regex12 = /ab?c/; // Matches 'a' followed by 0 or 1 'b', then 'c'
console.log(regex12.test("ac")); // Output: true -> 0 'b' is allowed
console.log(regex12.test("abc")); // Output: true -> 1 'b' is allowed
console.log(regex12.test("abbc")); // Output: false -> only 0 or 1 'b' is allowed

const regex13 = /a{2,4}/; // Matches between 2 and 4 'a's
console.log(regex13.test("aa")); // Output: true -> 2 'a's
console.log(regex13.test("aaa")); // Output: true -> 3 'a's
console.log(regex13.test("aaaaa")); // Output: false -> more than 4 'a's

// Basic Syntax:
// `*` - 0 or more occurrences
// `+` - 1 or more occurrences
// `?` - 0 or 1 occurrence
// `{n,m}` - between n and m occurrences

// Explanation:
// - Quantifiers control how many times a part of the pattern can appear.
// - Use `{n,m}` for precise control over repetition.

// 8. Special Characters (Escaping)
// Some characters like ., +, *, ?, etc. are special in regex. To match them literally, escape them with a backslash.

const regex14 = /\./; // Matches a literal period
console.log(regex14.test("file.txt")); // Output: true -> matches the period

const regex15 = /\d/; // Matches any digit (0-9)
console.log(regex15.test("123abc")); // Output: true -> digits are present

// Basic Syntax:
// `\.` - matches a literal period
// `\d` - matches any digit

// Explanation:
// - Special characters need to be escaped with a backslash (`\`) to match them literally.
// - Common special characters include `.`, `*`, `+`, `?`, etc.

// 9. Groups and Capturing with ()
// Parentheses () are used for grouping patterns and capturing parts of a match.

const regex16 = /(ab)+/; // Matches one or more occurrences of 'ab'
console.log(regex16.test("abab")); // Output: true

const regex17 = /(\d{3})-(\d{3})-(\d{4})/; // Matches a phone number pattern
const phoneNumber = "123-456-7890";
const match = phoneNumber.match(regex17);
console.log(match); // Output: ['123-456-7890', '123', '456', '7890'] -> captures area code, etc.

// Basic Syntax:
// `(pattern)` - captures part of the match for later use

// Explanation:
// - Parentheses are used to group patterns and capture matched parts for later use or reference.

// 10. Non-capturing Groups with (?:)
// Sometimes you want to group parts of the pattern without capturing them.

const regex18 = /(?:ab)+/; // Non-capturing group
console.log(regex18.test("abab")); // Output: true, but no capturing

// Basic Syntax:
// `(?:pattern)` - groups the pattern but does not capture it

// Explanation:
// - Non-capturing groups are useful when you don't need to store the matched part for later use.

// 11. Lookahead and Lookbehind
// Lookahead (?=...) and Lookbehind (?<=...) allow you to assert that something must follow or precede the current position, without including it in the match.

const regex19 = /hello(?=\sworld)/; // Matches 'hello' only if followed by ' world'
console.log(regex19.test("hello world")); // Output: true
console.log(regex19.test("hello there")); // Output: false

const regex20 = /hello(?!\sworld)/; // Matches 'hello' only if NOT followed by ' world'
console.log(regex20.test("hello world")); // Output: false
console.log(regex20.test("hello there")); // Output: true

const regex21 = /(?<=Mr\.\s)Smith/; // Matches 'Smith' only if preceded by 'Mr. '
console.log(regex21.test("Mr. Smith")); // Output: true
console.log(regex21.test("Dr. Smith")); // Output: false

const regex22 = /(?<!Dr\.\s)Smith/; // Matches 'Smith' only if NOT preceded by 'Dr. '
console.log(regex22.test("Mr. Smith")); // Output: true
console.log(regex22.test("Dr. Smith")); // Output: false

// Basic Syntax:
// `(?=pattern)` - positive lookahead
// `(?!pattern)` - negative lookahead
// `(?<=pattern)` - positive lookbehind
// `(?<!pattern)` - negative lookbehind

// Explanation:
// - Lookaheads and lookbehinds allow you to conditionally match based on what comes before or after a part of the pattern.

// 12. Replacing Patterns with .replace()
// The .replace() method allows you to replace parts of a string that match a regex pattern.

const regex23 = /apple/g;
const newStr = "apple orange apple".replace(regex23, "banana");
console.log(newStr); // Output: 'banana orange banana' -> all 'apple' are replaced with 'banana'

// Basic Syntax:
// `string.replace(regex, replacement)`

// Explanation:
// - .replace() allows you to replace matched patterns in a string with another value.

// 13. The .match() Method
// The .match() method returns an array with all matches of a pattern (or null if no match is found).

const str2 = "cat, bat, rat";
const regex24 = /[cbr]at/g; // Matches 'cat', 'bat', and 'rat'
const matches = str2.match(regex24);
console.log(matches); // Output: ['cat', 'bat', 'rat'] -> returns all matches

// Without the 'g' flag, .match() will only return the first match.
const firstMatch = str2.match(/rat/);
console.log(firstMatch); // Output: ['rat'] -> returns only the first match

// If there's no match, .match() returns null.
console.log("dog".match(regex24)); // Output: null -> no match

// Basic Syntax:
// `string.match(regex)`

// Explanation:
// - .match() returns an array of matches or `null` if no matches are found.

// 14. Practical Example: Email Validation
// Let's use what we've learned to create a regex that validates an email address.

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log(emailRegex.test("test@example.com")); // Output: true -> valid email
console.log(emailRegex.test("invalid-email")); // Output: false -> invalid email

// Basic Syntax:
// `regex.test(string)`

// Explanation:
// - This example uses a regex to validate an email format.
// - The regex ensures the email has a valid format with letters, numbers, dots, etc., and a proper domain.

// 15. The .exec() Method
// The .exec() method is used for more detailed matching, including capturing groups and their indices.

const regex25 = /(\d{3})-(\d{3})-(\d{4})/;
const execResult = regex25.exec("My phone number is 123-456-7890");
console.log(execResult);
/*
Output:
[
  '123-456-7890',
  '123',  // first capturing group
  '456',  // second capturing group
  '7890', // third capturing group
  index: 19, // the starting index of the match
  input: 'My phone number is 123-456-7890'
]
*/

// Basic Syntax:
// `regex.exec(string)`

// Explanation:
// - .exec() returns detailed information about the match, including capturing groups and the index of the match.

// 16. The .split() Method
// The .split() method allows splitting a string into an array using a regex pattern as the separator.

const str3 = "one, two, three, four";
const regex26 = /,\s*/; // Matches a comma followed by optional whitespace
const splitResult = str3.split(regex26);
console.log(splitResult); // Output: ['one', 'two', 'three', 'four']

// Basic Syntax:
// `string.split(regex)`

// Explanation:
// - .split() uses a regex pattern to split a string into an array of substrings.

// 17. Greedy vs Non-Greedy (Lazy) Quantifiers
// Greedy quantifiers match as much as possible. Lazy quantifiers match as little as possible.

const text = "I have <b>bold</b> and <b>more bold</b> text";

// Greedy: Matches the entire string from the first <b> to the last </b>
const greedyRegex = /<b>.*<\/b>/;
console.log(text.match(greedyRegex)); // Output: ['<b>bold</b> and <b>more bold</b>']

// Lazy (Non-greedy): Matches the shortest possible string
const lazyRegex = /<b>.*?<\/b>/;
console.log(text.match(lazyRegex)); // Output: ['<b>bold</b>']

// Basic Syntax:
// `.*` - greedy quantifier
// `.*?` - lazy (non-greedy) quantifier

// Explanation:
// - Greedy quantifiers (`*`, `+`) try to match as much text as possible.
// - Lazy quantifiers (`*?`, `+?`) try to match as little as possible.

// 18. Named Capturing Groups
// Named capturing groups allow assigning names to capture groups for easier reference.

const regex27 = /(?<areaCode>\d{3})-(?<prefix>\d{3})-(?<lineNumber>\d{4})/;
const namedResult = regex27.exec("123-456-7890");
console.log(namedResult.groups); // Output: { areaCode: '123', prefix: '456', lineNumber: '7890' }

// Basic Syntax:
// `(?<name>pattern)`

// Explanation:
// - Named capturing groups allow you to access matched groups by name, making it easier to work with complex patterns.

// 19. Assertions (Word Boundaries)
// Word boundaries (\b) assert positions between word characters and non-word characters.

const regex28 = /\bcat\b/;
console.log(regex28.test("the cat is here")); // Output: true -> matches 'cat' as a whole word
console.log(regex28.test("category")); // Output: false -> does not match 'cat' as part of 'category'

// Basic Syntax:
// `\b` - word boundary

// Explanation:
// - Word boundaries (`\b`) match positions between word characters (like letters and digits) and non-word characters (like spaces or punctuation).

// 20. Unicode Support with the 'u' Flag
// The 'u' flag enables Unicode support in regex.

const regex29 = /\u{1F60D}/; // Unicode for the heart eyes emoji
console.log(regex29.test("😍")); // Output: false -> doesn't match without 'u' flag

const regex30 = /\u{1F60D}/u; // With 'u' flag, it supports full Unicode
console.log(regex30.test("😍")); // Output: true

// Basic Syntax:
// `/pattern/u`

// Explanation:
// - The `u` flag allows regex patterns to correctly handle Unicode characters.

// 21. Dotall Mode with the 's' Flag
// The 's' flag allows the dot (.) to match newline characters as well.

const regex31 = /foo.bar/;
console.log(regex31.test("foo\nbar")); // Output: false -> dot does not match newlines

const regex32 = /foo.bar/s;
console.log(regex32.test("foo\nbar")); // Output: true -> dot matches newline with 's' flag

// Basic Syntax:
// `/pattern/s`

// Explanation:
// - The `s` flag makes the dot (`.`) match newline characters as well, which it doesn't by default.