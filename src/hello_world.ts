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