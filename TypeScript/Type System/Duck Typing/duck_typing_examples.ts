
// Example: Duck Typing

interface Duck {
    quack: () => void;
}

const duck: Duck = {
    quack: () => console.log("Quack!"),
};

// A different object with the same structure
const anotherDuck = {
    quack: () => console.log("Another quack!"),
};

let myDuck: Duck = anotherDuck; // Valid due to duck typing

// Function Parameter Validation
interface Logger {
    log: (message: string) => void;
}

function writeLog(logger: Logger) {
    logger.log("Logging a message!");
}

const simpleLogger = {
    log: (message: string) => console.log(message),
};

writeLog(simpleLogger); // Outputs: Logging a message!

// Assigning Objects
interface Point {
    x: number;
    y: number;
}

const point: Point = { x: 10, y: 20 };
const anotherPoint = { x: 15, y: 25, z: 30 };

const myPoint: Point = anotherPoint; // Valid, extra properties are ignored

// Objects with Methods
interface Greeter {
    greet: () => string;
}

const greeter = {
    greet: () => "Hello, world!",
    extra: "Additional data",
};

let myGreeter: Greeter = greeter; // Valid
console.log(myGreeter.greet());  // Outputs: Hello, world!
