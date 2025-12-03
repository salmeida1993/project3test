import { getDb } from "./mongo.js";
import { ObjectId } from "mongodb";

const COLLECTION = "trips";

// Create/insert a new trip
export async function createTrip(doc) {
  const db = await getDb();
  const trips = db.collection(COLLECTION);

  try {
    doc.createdAt = new Date();
    doc.updatedAt = new Date();

    const res = await trips.insertOne(doc);
    return await trips.findOne({ _id: res.insertedId });
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
}

// Get all trips for a specific user
export async function getTrips({
  userId,
  tripId,
  pageSize = 20,
  page = 0,
} = {}) {
  const db = await getDb();
  const trips = db.collection(COLLECTION);
  const filter = {};
  if (userId) filter.userId = userId;
  if (tripId) filter.tripId = tripId;

  return await trips
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * page)
    .toArray();
}

// Get a specific trip by its ID
export async function getTrip(tripId) {
  const db = await getDb();
  const trips = db.collection(COLLECTION);
  return await trips.findOne({ _id: tripId });
}

// Update a specific trip by its ID
export async function updateTrip(tripId, updates) {
  const db = await getDb();
  const trips = db.collection(COLLECTION);

  //console.log("Updating trip:", tripId, updates);
  updates.updatedAt = new Date();

  const result = await trips.findOneAndUpdate(
    { _id: tripId },
    { $set: updates },
    { returnDocument: "after" }
  );
  //console.log("Updated trip result:", result);
  return result;
}

// Delete a specific trip by its ID
export async function deleteTrip(tripId) {
  const db = await getDb();
  const trips = db.collection(COLLECTION);

  const result = await trips.deleteOne({ _id: tripId });
  return result.deletedCount === 1;
}

//Legs CRUD

// Add a leg to a specific trip
export async function addLegToTrip(tripId, leg) {
  const db = await getDb();
  const trips = db.collection(COLLECTION);

  try {
    const result = await trips.findOneAndUpdate(
      { _id: tripId },
      { $push: { legs: leg }, $set: { updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    return result;
  } catch (error) {
    console.error("Error adding leg to trip:", error);
    throw error;
  }
}

// Get all legs for a specific trip
export async function getLegs(tripId) {
  const db = await getDb();
  const trips = db.collection(COLLECTION);

  try {
    const trip = await trips.findOne(
      { _id: new ObjectId(tripId) },
      { projection: { legs: 1 } }
    );
    return trip?.legs || [];
  } catch (error) {
    console.error("Error fetching legs for trip:", error);
    throw error;
  }
}

// Update a leg by its ID within a specific trip
export async function updateLeg(tripId, legId, updates) {
  const db = await getDb();
  const trips = db.collection(COLLECTION);

  try {
    const result = await trips.findOneAndUpdate(
      { _id: new ObjectId(tripId), "legs._id": new ObjectId(legId) },
      {
        $set: Object.fromEntries(
          Object.entries(updates).map(([key, value]) => [
            `legs.$.${key}`,
            value,
          ])
        ),
      },
      { returnDocument: "after" }
    );
    return result.value;
  } catch (error) {
    console.error("Error updating leg:", error);
    throw error;
  }
}

// Delete a leg by its ID within a specific trip
export async function deleteLeg(tripId, legId) {
  const db = await getDb();
  const trips = db.collection(COLLECTION);

  try {
    const result = await trips.findOneAndUpdate(
      { _id: tripId },
      { $pull: { legs: { _id: legId } } },
      { returnDocument: "after" }
    );
    return result;
  } catch (error) {
    console.error("Error deleting leg:", error);
    throw error;
  }
}
