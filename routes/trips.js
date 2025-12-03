import express from "express";
import * as tripsDB from "../db/tripsDB.js";
import { geoLookup } from "../services/geoLookup.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Trips
// Create a new trip
router.post("/trips/userId/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      title,
      description = "",
      startDate = null,
      endDate = null,
      legs = [],
      expenses: {
        transportation = 0,
        food = 0,
        lodging = 0,
        extra = 0,
      },
      notes = "",
    } = req.body;

    const expenses = {
      transportation: transportation,
      food: food,
      lodging: lodging,
      extra: extra,
    };

    const processedLegs = [];
    for (const leg of legs) {
      const { city, state, days = 0 } = leg;
      const geo = await geoLookup(`${city}, ${state}`);

      processedLegs.push({
        _id: new ObjectId(),
        city,
        state,
        days,
        latitude: geo?.lat || null,
        longitude: geo?.lng || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    //console.log("Expenses:", expenses); // DEBUG

    const trip = await tripsDB.createTrip({
      userId,
      title,
      description,
      startDate,
      endDate,
      legs: processedLegs,
      expenses,
      notes,
    });
    res.status(201).json(trip);
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

// Get all trips for a user
router.get("/trips", async (req, res) => {
  console.log("GET /trips called");
  try {
    const { userId } = req.query;

    const trips = await tripsDB.getTrips({ userId });
    res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

//Get a specific trip by ID
router.get("/trips/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    let objectTripId;
    try {
      objectTripId = new ObjectId(tripId);
    } catch {
      return res.status(400).json({ error: "Invalid trip ID format" });
    }
    const trip = await tripsDB.getTrip(objectTripId);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
});

// Update a specific trip by ID
router.patch("/trips/:tripId", async (req, res) => {
  console.log("PATCH /trips/:tripId called");
  try {
    const { tripId } = req.params;
    const updates = req.body;

    let objectTripId;
    try {
      objectTripId = new ObjectId(tripId);
    } catch {
      return res.status(400).json({ error: "Invalid trip ID format" });
    }

    delete updates._id; // Prevent changing the _id field
    const updatedTrip = await tripsDB.updateTrip(objectTripId, updates);
    if (!updatedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ error: "Failed to update trip" });
  }
});

// Delete a specific trip by ID
router.delete("/trips/:tripId", async (req, res) => {
  console.log("DELETE /trips/:tripId called");
  try {
    const { tripId } = req.params;
    let objectTripId;
    try {
      objectTripId = new ObjectId(tripId);
    } catch {
      return res.status(400).json({ error: "Invalid trip ID format" });
    }
    const deletedTrip = await tripsDB.deleteTrip(objectTripId);
    if (!deletedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

// Legs
// Update a specific leg of a trip
router.patch("/trips/:tripId/legs/:legId", async (req, res) => {
  try {
    const { tripId, legId } = req.params;
    const updates = req.body;
    const updatedLeg = await tripsDB.updateLeg(tripId, legId, updates);
    if (!updatedLeg) {
      return res.status(404).json({ error: "Leg not found" });
    }
    res.status(200).json(updatedLeg);
  } catch (error) {
    console.error("Error updating leg:", error);
    res.status(500).json({ error: "Failed to update leg" });
  }
});

// Delete a specific leg of a trip
router.delete("/trips/:tripId/legs/:legId", async (req, res) => {
  try {
    const { tripId, legId } = req.params;
    let objectTripId;
    let objectLegId;
    try {
      objectTripId = new ObjectId(tripId);
      objectLegId = new ObjectId(legId);
    } catch {
      return res.status(400).json({ error: "Invalid trip ID format" });
    }
    const deletedLeg = await tripsDB.deleteLeg(objectTripId, objectLegId);
    if (!deletedLeg) {
      return res.status(404).json({ error: "Leg not found" });
    }
    res.status(200).json(deletedLeg);
  } catch (error) {
    console.error("Error deleting leg:", error);
    res.status(500).json({ error: "Failed to delete leg" });
  }
});

// Add a new leg to a trip
router.post("/trips/:tripId/legs", async (req, res) => {
  try {
    const { tripId } = req.params;
    let objectTripId;
    try {
      objectTripId = new ObjectId(tripId);
    } catch {
      return res.status(400).json({ error: "Invalid trip ID format" });
    }
    const { city, state, days = 0 } = req.body;
    const geo = await geoLookup(`${city}, ${state}`);

    const leg = {
      _id: new ObjectId(),
      city,
      state,
      days,
      latitude: geo?.lat || null,
      longitude: geo?.lng || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTrip = await tripsDB.addLegToTrip(objectTripId, leg);
    if (!updatedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.status(201).json(updatedTrip);
  } catch (error) {
    console.error("Error adding leg to trip:", error);
    res.status(500).json({ error: "Failed to add leg to trip" });
  }
});

export default router;
