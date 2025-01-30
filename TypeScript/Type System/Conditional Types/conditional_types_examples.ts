
// Basic Example
type IsString<T> = T extends string ? "Yes" : "No";

type Test1 = IsString<string>; // "Yes"
type Test2 = IsString<number>; // "No"

// Extract Example
type MyExtract<T, U> = T extends U ? T : never;
type Extracted = MyExtract<"a" | "b" | "c", "a" | "c">; // "a" | "c"

// Exclude Example
type MyExclude<T, U> = T extends U ? never : T;
type Excluded = MyExclude<"a" | "b" | "c", "a" | "c">; // "b"

// Distributed Conditional Types
type Example<T> = T extends string ? "String" : "Other";
type Distributed = Example<string | number>; // "String" | "Other"

// Using `infer`
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type FunctionReturnType = GetReturnType<() => string>; // string

// Utility: Filtering Types
type Filter<T, U> = T extends U ? T : never;
type OnlyNumbers = Filter<number | string | boolean, number>; // number

// Utility: Mapping Unions
type MapUnion<T> = T extends string ? `Mapped ${T}` : never;
type MappedResult = MapUnion<"a" | "b" | "c">; // "Mapped a" | "Mapped b" | "Mapped c"
