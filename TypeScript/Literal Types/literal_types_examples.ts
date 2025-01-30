
// Boolean Literal Type
let isEnabled: true;
isEnabled = true; // ✅ Valid
// isEnabled = false; // ❌ Error

// String Literal Type
type Direction = "left" | "right" | "up" | "down";
let move: Direction;
move = "left";  // ✅ Valid
// move = "forward"; // ❌ Error

// Number Literal Type
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll;
roll = 3; // ✅ Valid
// roll = 7; // ❌ Error

// Function with Literal Types
function logStatus(status: "success" | "error"): void {
    console.log(`Status: ${status}`);
}

logStatus("success"); // ✅ Outputs: Status: success
// logStatus("pending"); // ❌ Error

// Conditional Types with Literal Types
type IsString<T> = T extends string ? "String Type" : "Non-String Type";

type Test1 = IsString<"hello">;  // "String Type"
type Test2 = IsString<42>;       // "Non-String Type"

// Discriminated Union Example
type ApiResponse =
    | { status: "success"; data: string }
    | { status: "error"; error: string };

function handleResponse(response: ApiResponse) {
    if (response.status === "success") {
        console.log("Data:", response.data);
    } else {
        console.error("Error:", response.error);
    }
}

// Example Usage
handleResponse({ status: "success", data: "User fetched successfully" }); // ✅
// handleResponse({ status: "error", error: "User not found" }); // ✅
// handleResponse({ status: "loading" }); // ❌ Error
