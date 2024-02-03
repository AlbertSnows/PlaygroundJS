// https://type-level-typescript.com/

type Hello = "World";
type test1 = Expect<Equal<Hello, "World">>;

navigate("user/:userId", { userId: "2" });
navigate("user/:userId/dashboard(/:dashboardId)", { userId: "2" });
navigate("user/:userId/dashboard(/:dashboardId)", { userId: "1", dashboardId: "2" });
navigate("user/:userId/dashboard(/:dashboardId)", { userId: "2" });

type ParseUrlParams<Url> =
  Url extends `${infer Path}(${infer OptionalPath})`
    ? ParseUrlParams<Path> & Partial<ParseUrlParams<OptionalPath>>
    : Url extends `${infer Start}/${infer Rest}`
    ? ParseUrlParams<Start> & ParseUrlParams<Rest>
    : Url extends `:${infer Param}`
    ? { [K in Param]: string }
    : {};

// navigate to a different route
function navigate<T extends string>(
	path: T,
  params: ParseUrlParams<T>) {
  // interpolate params
  let url = Object.entries<string>(params).reduce<string>(
    (path, [key, value]) => path.replace(`:${key}`, value),
    path
  );

  // clean url
  url = url.replace(/(\(|\)|\/?:[^\/]+)/g, '')

  // update url
  history.pushState({}, '', url);
}

namespace challenge {
  type DoNothing<T> = T
  
  type res1 = DoNothing<"🖖">;
  type test1 = Expect<Equal<res1, "🖖">>;
}

let x: number = "Hello"; // this line does not.
let y: number = 2; // this line does!

namespace identity {

  function identity<A>(a: A): A {
    return a;
  }

  let input1 = 10;
  let res1 = identity(input1);
  
  type test1 = Expect<Equal<typeof res1, number>>;

  let input2 = "Hello";
  let res2 = identity(input2);
  
  type test2 = Expect<Equal<typeof res2, string>>;

}

namespace safeHead {

  function safeHead<A>(array: A[], defaultValue: A): A {
    return array[0] ?? defaultValue;
  }

  let input1 = [1, 2, 3];
  let res1 = safeHead(input1, 0);
  
  type test1 = Expect<Equal<typeof res1, number>>;

  let input2 = ["Hello", "Hola", "Bonjour"];
  let res2 = safeHead(input2, "Hi");
  
  type test2 = Expect<Equal<typeof res2, string>>;

}

namespace map {

  function map<A, B>(array: A[], fn: (value: A) => B): B[] {
    return array.map(fn);
  }

  let input1 = [1, 2, 3];
  let res1 = map(input1, value => value.toString());
  
  type test1 = Expect<Equal<typeof res1, string[]>>;

  let input2 = ["Hello", "Hola", "Bonjour"];
  let res2 = map(input2, str => str.length);
  
  type test2 = Expect<Equal<typeof res2, number[]>>;

}

namespace pipe2 {

  function pipe2<A, B, C>(
    x: A,
    f1: (value: A) => B,
    f2: (value: B) => C
  ): C {
    return f2(f1(x));
  }

  let res1 = pipe2(
    [1, 2, 3],
    arr => arr.length,
    length => `length: ${length}`
  );

  type test1 = Expect<Equal<typeof res1, string>>;

  let res2 = pipe2(
    { name: 'Alice' },
    user => user.name,
    name => name.length > 5
  );
  
  type test2 = Expect<Equal<typeof res2, boolean>>;

}

type Primitives =
  | number
  | string
  | boolean
  | symbol
  | bigint
  | undefined
  | null;

	type DataStructures =
  | { key1: boolean; key2: number } // objects
  | { [key: string]: number } // records
  | [boolean, number] // tuples
  | number[]; // arrays

let hi: "Hi" = "Hi";
let hello: "Hello" = "Hello";

let greeting: string;

greeting = hi; // ✅ type-checks!
greeting = hello; // ✅ type-checks!

hello = greeting; // ❌ doesn't type-check!

let greeting: string = "Hello";
let age: number = greeting; // ❌ doesn't type-check.

let canCross = "orange" as CanCross; // ✅
let shouldStop = "orange" as ShouldStop; // ✅
canCross = shouldStop;
//       ❌ ~~~~~~~~~ type 'red' isn't assignable to the type `green` | 'orange'
shouldStop = canCross;
//         ❌ ~~~~~~~ type 'green' isn't assignable to the type `orange` | 'red'

let something: unknown;

something = "Hello";            // ✅
something = 2;                  // ✅
something = { name: "Alice" };  // ✅
something = () => "?";          // ✅
 
const username: string = panic(); // ✅ TypeScript is ok with this!
const age: number = panic(); // ✅ And with this.
const theUniverse: unknown = panic(); // ✅ Actually, this will always work.

type U = "Hi" | "Hello" | never;
// is equivalent to:
type U = "Hi" | "Hello";

namespace move {
  
  function move(direction: "backward" | "forward") {
    // some imaginary code that makes the thing move!
  }

  // ✅
  move("backward")

  // ✅
  move("forward")

  // @ts-expect-error: ❌ not supported
  move("left")

  // @ts-expect-error: ❌ not supported
  move("right")
}

namespace pickOne {

  function pickOne<A, B>(a: A, b: B): A | B {
    return Math.random() > 0.5 ? a : b;
  }

  const res1 = pickOne(true, false);
  type test1 = Expect<Equal<typeof res1, boolean>>;

  const res2 = pickOne(1, 2);
  type test2 = Expect<Equal<typeof res2, 1 | 2>>;

  const res3 = pickOne(2, "some string");
  type test3 = Expect<Equal<typeof res3, 2 | "some string">>;

  const res4 = pickOne(true, 7);
  type test4 = Expect<Equal<typeof res4, true | 7>>;
}

namespace merge {
  function merge<A, B>(a: A, b: B): A & B {
    return { ...a, ...b };
  }

  const res1 = merge({ name: "Bob" }, { age: 42 });
  type test1 = Expect<Equal<typeof res1, { name: string } & { age: number }>>;

  const res2 = merge({ greeting: "Hello" }, {});
  type test2 = Expect<Equal<typeof res2, { greeting: string }>>;

  const res3 = merge({}, { greeting: "Hello" });
  type test3 = Expect<Equal<typeof res3, { greeting: string }>>;

  const res4 = merge({ a: 1, b: 2 }, { c: 3, d: 4 });
  type test4 = Expect<
    Equal<typeof res4, { a: number; b: number } & { c: number; d: number }>
  >;
}

namespace debouncedFn {
  
  let debouncedFn: Function & { cancel: Function } 

  debouncedFn = Object.assign(() => {}, { cancel: () => {} });

  // ✅
  debouncedFn();

  // ✅
  debouncedFn.cancel();

  // ❌ `unknownMethod` does not exist on `debouncedFn`.
  // @ts-expect-error
  debouncedFn.unknownMethod();

  // ❌ can't assign a string to `debouncedFn`.
  // @ts-expect-error: ❌
  debouncedFn = "Hello";
}

namespace stringify {
  
  function stringify(input: unknown) {
    return input instanceof Symbol ? input.toString() : `${input}`;
  }

  stringify("a string");    // ✅
  stringify(12);            // ✅
  stringify(true);          // ✅
  stringify(Symbol("cat")); // ✅
  stringify(20000n);        // ✅
}

namespace exhaustive {
  
  function exhaustive(...args: never) {}

  const HOURS_PER_DAY = 24
  // Since `HOURS_PER_DAY` is a `const`, the next
  // condition can never happen
  // ✅
  if (HOURS_PER_DAY !== 24) exhaustive(HOURS_PER_DAY);

  // Outside of the condition, this should
  // return a type error.
  // @ts-expect-error ❌
  exhaustive(HOURS_PER_DAY);


  const exhautiveCheck = (input: 1 | 2) => {
    switch (input) {
      case 1: return "!";
      case 2: return "!!";
      // Since all cases are handled, the default
      // branch is unreachable.
      // ✅
      default: exhaustive(input);
    }
  }

  const nonExhautiveCheck = (input: 1 | 2) => {
    switch (input) {
      case 1: return "!";
      // the case where input === 2 isn't handled,
      // so `exhaustive` shouldn't be called.
      // @ts-expect-error ❌
      default: exhaustive(input);
    }
  }
}

type SomeObject = { key1: boolean; key2: number };

type SomeRecord = { [key: string]: number };

type FourKindsOfDataStructures =
  | { key1: boolean; key2: number } // objects
  | { [key: string]: number } // records
  | [boolean, number] // tuples
  | number[]; // arrays

	type User = {
		name: string;
		age: number;
		isAdmin: boolean;
	};

	// ✅ this object is in the `User` set.
const gabriel: User = {
  name: "Gabriel",
  isAdmin: true,
  age: 28,
};

// ❌
const bob: User = {
  name: "Bob",
  age: 45,
  // <- the `isAdmin` key is missing.
};

// ❌
const peter: User = {
  name: "Peter",
  isAdmin: false,
  age: "45" /* <- the `age` key should be of type `number`,
                   but it's assigned to a `string`. */,
};
type User = { name: string; age: number; isAdmin: boolean };

type Age = User["age"]; // => number
type Role = User["isAdmin"]; // => boolean

type Age = User.age;
//             ^ ❌ syntax error!

type User = { name: string; age: number; isAdmin: boolean };

type NameOrAge = User["name" | "age"]; // => string | number
type NameOrAge = User["name"] | User["age"]; // => string | number

type User = {
  name: string;
  age: number;
  isAdmin: boolean;
};

type Keys = keyof User; // "name" | "age" | "isAdmin"

type User = {
  name: string;
  age: number;
  isAdmin: boolean;
};

type Keys = keyof User; // "name" | "age" | "isAdmin"

type User = {
  name: string;
  age: number;
  isAdmin: boolean;
};

type UserValues = User[keyof User]; //  string | number | boolean

type ValueOf<Obj> = Obj[keyof Obj];

type UserValues = ValueOf<User>; //  string | number | boolean

type BlogPost = { title: string; tags?: string[] };
//                                   ^ this property is optional!

// ✅ No `tags` property
const blogBost1: BlogPost = { title: "introduction" };

// ✅ `tags` contains a list of strings
const blogBost2: BlogPost = {
  title: "part 1",
  tags: ["#easy", "#beginner-friendly"],
};

type BlogPost = { title: string; tags: string[] | undefined };

const blogBost1: BlogPost = { title: "part 1" };
//             ^ ❌ type error: the `tags` key is missing.

// ✅
const blogBost2: BlogPost = { title: "part 1", tags: undefined };

type A = { a: string };
type KeyOfA = keyof A; // => 'a'

type B = { b: number };
type KeyOfB = keyof B; // => 'b'

type C = A & B;
type KeyOfC = keyof C; // => 'a' | 'b'

type A = { a: string; c: boolean };
type KeyOfA = keyof A; // => 'a' | 'c'

type B = { b: number; c: boolean };
type KeyOfB = keyof B; // => 'b' | 'c'

type C = A | B;
type KeyOfC = keyof C; // => ('a' | 'c') & ('b' | 'c') <=> 'c'

keyof (A & B) = (keyof A) | (keyof B)

keyof (A | B) = (keyof A) & (keyof B)

type WithName = { name: string; id: string };
type WithAge = { age: number; id: number };
type User = WithName & WithAge;

type Id = User["id"]; // => string & number <=> never

interface User extends WithName, WithAge, WithRole {}
interface Organization extends WithName, WithAge {}

type RecordOfBooleans = { [key: string]: boolean };
type RecordOfBooleans = Record<string, boolean>;
type Record<K, V> = { [Key in K]: V };

type InputState = Record<"valid" | "edited" | "focused", boolean>;
type InputState = { [Key in "valid" | "edited" | "focused"]: boolean };
type InputState = { valid: boolean; edited: boolean; focused: boolean };
type ValueType = RecordOfBooleans[string]; // => boolean

type Props = { value: string; focused: boolean; edited: boolean };

type PartialProps = Partial<Props>;
// is equivalent to:
type PartialProps = { value?: string; focused?: boolean; edited?: boolean };

type Props = { value?: string; focused?: boolean; edited?: boolean };

type RequiredProps = Required<Props>;
// is equivalent to:
type RequiredProps = { value: string; focused: boolean; edited: boolean };

type Props = { value: string; focused: boolean; edited: boolean };

type ValueProps = Pick<Props, "value">;
// is equivalent to:
type ValueProps = { value: string };

type SomeProps = Pick<Props, "value" | "focused">;
// is equivalent to:
type SomeProps = { value: string; focused: boolean };

type Props = { value: string; focused: boolean; edited: boolean };

type ValueProps = Omit<Props, "value">;
// is equivalent to:
type ValueProps = { edited: boolean; focused: boolean };

type OtherProps = Omit<Props, "value" | "focused">;
// is equivalent to:
type OtherProps = { edited: boolean };

/**
 * 1. implement a generic to get the union of all keys of an object type.
 */
namespace keys {
  type Keys<Obj> = keyof Obj

  type res1 = Keys<{ a: number; b: string }>;
  type test1 = Expect<Equal<res1, "a" | "b">>;

  type res2 = Keys<{ a: number; b: string; c: unknown }>;
  type test2 = Expect<Equal<res2, "a" | "b" | "c">>;

  type res3 = Keys<{}>;
  type test3 = Expect<Equal<res3, never>>;

  type res4 = Keys<{ [K in string]: boolean }>;
  type test4 = Expect<Equal<res4, string>>;
}

/**
 * 2. implement a generic to get the union of all values in an object type.
 */
namespace valueof {
  type ValueOf<Obj> = Obj[keyof Obj]

  type res1 = ValueOf<{ a: number; b: string }>;
  type test1 = Expect<Equal<res1, number | string>>;

  type res2 = ValueOf<{ a: number; b: string; c: boolean }>;
  type test2 = Expect<Equal<res2, number | string | boolean>>;

  type res3 = ValueOf<{}>;
  type test3 = Expect<Equal<res3, never>>;

  type res4 = ValueOf<{ [K in string]: boolean }>;
  type test4 = Expect<Equal<res4, boolean>>;
}

/**
 * Create a generic that removes the `id` key
 * from an object type.
 */
namespace removeId {
  type RemoveId<Obj> = TODO

  type res1 = RemoveId<{
    id: number;
    name: string;
    age: unknown;
  }>;

  type test1 = Expect<
    Equal<res1, { name: string; age: unknown }>
  >;

  type res2 = RemoveId<{
    id: number;
    title: string;
    content: string;
  }>;

  type test2 = Expect<
    Equal<res2, { title: string; content: string }>
  >;
}

/**
 * Create a generic that removes the `id` key
 * from an object type.
 */
namespace removeId {
  type RemoveId<Obj> = Omit<Obj, "id">

  type res1 = RemoveId<{
    id: number;
    name: string;
    age: unknown;
  }>;

  type test1 = Expect<
    Equal<res1, { name: string; age: unknown }>
  >;

  type res2 = RemoveId<{
    id: number;
    title: string;
    content: string;
  }>;

  type test2 = Expect<
    Equal<res2, { title: string; content: string }>
  >;
}

namespace optionalId {
  /**           This is called a type constraint. 
   *            We'll learn more about them soon.
   *                         👇                      */
  type MakeIdOptional<Obj extends { id: unknown }> =
    Partial<Pick<Obj, "id">> & Omit<Obj, "id">

  type res1 = MakeIdOptional<{
    id: number;
    name: string;
    age: unknown;
  }>;

  type test1 = Expect<
    Equal<res1, { id?: number } & { name: string; age: unknown }>
  >;

  type res2 = MakeIdOptional<{
    id: string;
    title: string;
    content: string;
  }>;

  type test2 = Expect<
    Equal<res2, { id?: string } & { title: string; content: string }>
  >;
}

namespace assign {
  type Assign<A, B> = Omit<A, keyof B> & B

  const assign = <A, B>(obj1: A, obj2: B): Assign<A, B> => ({
    ...obj1,
    ...obj2,
  });

  // Override `id`
  type res1 = Assign<{ name: string; id: number }, { id: string }>;
  type test1 = Expect<Equal<res1, { name: string } & { id: string }>>;

  // Override `age` and `role`
  type res2 = Assign<
    { name: string; age: string; role: string },
    { age: 42; role: "admin" }
  >;
  type test2 = Expect<
    Equal<res2, { name: string } & { age: 42; role: "admin" }>
  >;

  // No overlap
  type res3 = Assign<{ name: string; id: number }, { age: number }>;
  type test3 = Expect<
    Equal<res3, { name: string; id: number } & { age: number }>
  >;

  // Using type inference from values
  const res4 = assign({ name: "Bob", id: 4 }, { id: "3" });
  type test4 = Expect<Equal<typeof res4, { name: string } & { id: string }>>;
}

type Empty = [];
type One = [1];
type Two = [1, "2"]; // types can be different!
type Three = [1, "2", 1]; // tuples can contain duplicates

type User = { name: string; age: number; isAdmin: true };

type NameOrAge = User["name" | "age"]; // => string | number

type SomeTuple = ["Bob", 28, true];

type NameOrAge = SomeTuple[0 | 1]; // => "Bob" | 28

type SomeTuple = ["Bob", 28, true];

type Values = SomeTuple[number]; // "Bob" | 28 | true

type Tuple1 = [4, 5];

type Tuple2 = [1, 2, 3, ...Tuple1];
// => [1, 2, 3, 4, 5]
type Tuple1 = [1, 2, 3];
type Tuple2 = [4, 5];

type Tuple3 = [...Tuple1, ...Tuple2];
// => [1, 2, 3, 4, 5]

type OptTuple = [string, number?];
//                             ^ optional index!

const tuple1: OptTuple = ["Bob", 28]; // ✅
const tuple2: OptTuple = ["Bob"]; // ✅
const tuple3: OptTuple = ["Bob", undefined]; // ✅
//    ^ we can also explicitly set it to `undefined`

type Tags = string[];

type Users = Array<User>; // same as `User[]`

type Bits = (0 | 1)[];

type BooleanRecord = { [k: string]: boolean };
type BooleanArray = boolean[];

type SomeArray = boolean[];

type Content = SomeArray[number]; // boolean

namespace first {
  type First<Tuple extends any[]> = Tuple[0]

  type res1 = First<[]>;
  type test1 = Expect<Equal<res1, undefined>>;

  type res2 = First<[string]>;
  type test2 = Expect<Equal<res2, string>>;

  type res3 = First<[2, 3, 4]>;
  type test3 = Expect<Equal<res3, 2>>;

  type res4 = First<["a", "b", "c"]>;
  type test4 = Expect<Equal<res4, "a">>;
}

namespace append {
  type Append<Tuple extends any[], Element> = [...Tuple, Element]

  type res1 = Append<[1, 2, 3], 4>;
  type test1 = Expect<Equal<res1, [1, 2, 3, 4]>>;

  type res2 = Append<[], 1>;
  type test2 = Expect<Equal<res2, [1]>>;
}

namespace concat {
  type Concat<Tuple1 extends any[], Tuple2 extends any[]> =
    [...Tuple1, ...Tuple2]

  type res1 = Concat<[1, 2, 3], [4, 5]>;
  type test1 = Expect<Equal<res1, [1, 2, 3, 4, 5]>>;

  type res2 = Concat<[1, 2, 3], []>;
  type test2 = Expect<Equal<res2, [1, 2, 3]>>;
}

namespace tupleToArray {
  type TupleToArray<Tuple extends any[]> = Tuple[number][]

  type res1 = TupleToArray<[1, 2, 3]>;
  type test1 = Expect<Equal<res1, (1 | 2 | 3)[]>>;

  type res2 = TupleToArray<[number, string]>;
  type test2 = Expect<Equal<res2, (number | string)[]>>;

  type res3 = TupleToArray<[]>;
  type test3 = Expect<Equal<res3, never[]>>;

  type res4 = TupleToArray<[1] | [2] | [3]>;
  type test4 = Expect<Equal<res4, (1 | 2 | 3)[]>>;
}

namespace nonEmptyArray {
  type NonEmptyArray<T> = [T, ...T[]]

  function sendMail(addresses: NonEmptyArray<string>) {
    /* ... */
  }

  sendMail(["123 5th Ave"]); // ✅
  sendMail(["75 rue Quincampoix", "75003 Paris"]); // ✅
  // @ts-expect-error
  sendMail([]);
  //       ^ ❌ `[]` isn't assignable to `NonEmptyArray<string>`
}

namespace length {
  type Length<Tuple extends any[]> = Tuple["length"]

  type res1 = Length<[]>;
  type test1 = Expect<Equal<res1, 0>>;

  type res2 = Length<[any]>;
  type test2 = Expect<Equal<res2, 1>>;

  type res3 = Length<[any, any]>;
  type test3 = Expect<Equal<res3, 2>>;

  type res4 = Length<[any, any, any]>;
  type test4 = Expect<Equal<res4, 3>>;
}

namespace lengthPlusOne {
  type LengthPlusOne<Tuple extends any[]> = [...Tuple, any]["length"]

  type res1 = LengthPlusOne<[]>;
  type test1 = Expect<Equal<res1, 1>>;

  type res2 = LengthPlusOne<[any]>;
  type test2 = Expect<Equal<res2, 2>>;

  type res3 = LengthPlusOne<[any, any]>;
  type test3 = Expect<Equal<res3, 3>>;

  type res4 = LengthPlusOne<[any, any, any]>;
  type test4 = Expect<Equal<res4, 4>>;
}