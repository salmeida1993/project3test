import "dotenv/config";
import { MongoClient, ObjectId } from "mongodb";

const {
  MONGO_URI = "mongodb://127.0.0.1:27017",
  MONGO_DB = "tripTracker",
} = process.env;

const client = new MongoClient(MONGO_URI);

function randState() {
  const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  const n = Math.floor(Math.random()*5)+1;
  const arr = new Set();
  while (arr.size < n) arr.add(states[Math.floor(Math.random()*states.length)]);
  return [...arr];
}

async function main() {
  await client.connect();
  const db = client.db(MONGO_DB);
  const users = db.collection("users");
  const trips = db.collection("trips");

  // ensure demo user
  let u = await users.findOne({ email: "demo@seed.local" });
  if (!u) {
    const r = await users.insertOne({ name: "Demo Seed", email: "demo@seed.local", pass: "x", createdAt:new Date(), updatedAt:new Date() });
    u = await users.findOne({ _id: r.insertedId });
  }

  const docs = [];
  for (let i = 0; i < 1200; i++) {
    docs.push({
      userId: u._id,
      tripName: `Seed Trip #${i+1}`,
      statesVisited: randState(),
      totalCost: Math.floor(Math.random()*2000),
      notes: "synthetic record",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await trips.insertMany(docs, { ordered: false });
  console.log("Inserted", docs.length, "trips");
  await client.close();
}

main().catch(e => { console.error(e); process.exit(1); });
