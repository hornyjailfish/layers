// import Surreal from "https://deno.land/x/surrealdb/mod.ts";
import { Surreal, jsonify } from "https://unpkg.com/surrealdb.js";

let db = new Surreal();
// let db = new Surreal({flatMode: true});

export function json(x){
    return jsonify(x);
};

export async function initDb() {
    // if (db) return db;
    // const db = new Surreal();
    try {
        await db.connect("http://127.0.0.1:8000/rpc");
        await db.use({ namespace: "ns", database: "db" });
        return db;
    } catch (err) {
        console.error("Failed to connect to SurrealDB:", err);
        throw err;
    }
}

export async function closeDb() {
    if (!db) return;
    await db.close();
    db = undefined;
}

export function getDb() {
    return db;
}
