
// Example 1: Basic Index Signature
type Dictionary = {
    [key: string]: string;
};

const translations: Dictionary = {
    hello: "hola",
    goodbye: "adios",
};

// Example 2: Restricting Key Types
type Scores = {
    [key: number]: string;
};

const scores: Scores = {
    1: "Alice",
    2: "Bob",
    3: "Charlie",
};

// Example 3: Combining Index Signatures with Explicit Properties
type Config = {
    appName: string;
    [key: string]: string;
};

const config: Config = {
    appName: "MyApp",
    apiUrl: "https://api.example.com",
    timeout: "5000ms",
};

// Example 4: Read-Only Index Signature
type ReadOnlyConfig = {
    readonly [key: string]: string;
};

const readOnlyConfig: ReadOnlyConfig = {
    apiUrl: "https://api.example.com",
};

// readOnlyConfig.apiUrl = "https://new-api.com"; // ❌ Error

// Example 5: Optional Index Signature
type OptionalConfig = {
    [key: string]: string | undefined;
};

const optionalConfig: OptionalConfig = {
    apiUrl: "https://api.example.com",
    timeout: undefined, // ✅ Valid
};

// Example 6: Function Map with Index Signatures
type FunctionMap = {
    [key: string]: () => void;
};

const handlers: FunctionMap = {
    onClick: () => console.log("Clicked"),
    onHover: () => console.log("Hovered"),
};

handlers.onClick(); // ✅ Outputs: Clicked
handlers.onHover(); // ✅ Outputs: Hovered
