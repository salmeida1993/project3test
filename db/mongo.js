import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI;
const DB_NAME = "tripTracker";

if (!URI) {
  throw new Error("MONGO_URI environment variable not set");
}

let client;
let db;

// Singleton connection
export async function getDb() {
  if (db) return db;
  client = new MongoClient(URI, { ignoreUndefined: true });
  await client.connect();
  db = client.db(DB_NAME);

  // Ensure unique index on users email
  const users = db.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });

  return db;
}

export async function closeDb() {
  if (client) await client.close();
}

export function toObjectId(id) {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  if (typeof id === "string" && id.length === 24) return new ObjectId(id);
  if (typeof id === "object" && id.$oid) return new ObjectId(id.$oid);
  throw new Error(`Invalid ObjectId: ${JSON.stringify(id)}`);
}
