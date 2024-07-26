import {
  RecordId,
  Surreal,
  Table,
} from "https://deno.land/x/surrealdb@v1.0.0-beta.9/mod.ts";

const db = new Surreal();

// Connect to the database
await db.connect("http://127.0.0.1:8000/rpc");

// Select a specific namespace / database
await db.use({
  namespace: "test",
  database: "test",
});

// Signin as a namespace, database, or root user
await db.signin({
  username: "root",
  password: "root",
});

const data = await import("./static/-1sh.json", {
  with: { type: "json" },
});
// Create a new person with a random id
let created = await db.create("test", data.default);

// Select all people records
let people = await db.select("test");
console.log(people);

Deno.exit();
