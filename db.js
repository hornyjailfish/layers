import {
  Surreal,
} from "https://deno.land/x/surrealdb/mod.ts";

const db = new Surreal();

// Connect to the database
await db.connect("http://127.0.0.1:8000/rpc");

// Select a specific namespace / database
await db.use({
  namespace: "ns",
  database: "db",
});

// Signin as a namespace, database, or root user
await db.signin({
  username: "root",
  password: "root",
});

// const data = await import("./static/-1sh.json", {
//   with: { type: "json" },
// });
// // Create a new person with a random id
// let created = await db.create("test", data.default);

// Select all people records
let geo = await db.select("geo");
console.log(geo);

Deno.exit();
