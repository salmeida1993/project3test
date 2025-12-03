import React, { useEffect, useState, useMemo } from "react";
import { Button, Modal } from "react-bootstrap";
import USMap from "../components/trips/USMap.jsx";
import TripFormModal from "../components/trips/TripFormModal.jsx";
import TripAccordion from "../components/trips/TripAccordion.jsx";
import TripStats from "../components/trips/TripStats.jsx";
import TripFilters from "../components/trips/TripFilters.jsx";


function getVisitedStates(trips) {
  const states = new Set();
  trips.forEach((trip) => {
    trip.legs.forEach((leg) => {
      if (leg.state) states.add(leg.state);
    });
  });
  return Array.from(states);
}

function getTotalExpense(trip) {
  if (!trip.expenses) return 0;
  return Object.values(trip.expenses).reduce(
    (sum, val) => sum + Number(val || 0),
    0
  );
}

export default function Trip() {
  const [showTripForm, setShowTripForm] = useState(false);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const [sortFilter, setSortFilter] = useState("none");
  const [stateFilter, setStateFilter] = useState("");
  const [maxExpense, setMaxExpense] = useState("");
  const [userId, setUserId] = useState(null);

  //const userId = "testUserId"; // Replace with actual user ID from auth context

  useEffect(() => {
    // Fetch user ID from auth context or other source
    async function fetchUserId() {
      try {
        console.log("Fetching user ID..."); // DEBUG
        const res = await fetch("/users/me");
        if (!res.ok) {
          setUserId(null);
          return;
        }
        const data = await res.json();
  
        setUserId(data.user._id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    async function loadTrips() {
      try {
        const res = await fetch(`/api/trips?userId=${userId}`);
        const data = await res.json();
        console.log("Fetched trips:", data); // DEBUG
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    }
    loadTrips();
  }, [userId]);

  const handleEditTrip = (trip) => {
    console.log("Editing trip:", trip);
    setSelectedTrip(trip);
    setShowTripForm(true);
  };

  const handleSaveTrip = async (trip) => {
    try {
      let savedTrip;
      if (trip._id) {
        // Edit existing trip
        console.log("Saving trip:", trip._id); // DEBUG
        const response = await fetch(`/api/trips/${trip._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trip),
        });
        savedTrip = await response.json();
        setTrips((prev) =>
          prev.map((t) => (t._id === savedTrip._id ? savedTrip : t))
        );
      } else {
        // Add new trip
        console.log("Adding new trip", trip); // DEBUG
        const response = await fetch(`/api/trips/userId/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trip),
        });
        savedTrip = await response.json();
        setTrips((prev) => [...prev, savedTrip]);
      }
      setSelectedTrip(null); // Clear selected trip after saving
      setShowTripForm(false);
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  const handleDeleteTrip = (trip) => {
    if (
      !window.confirm(
        `Delete trip "${trip.title}"? This action cannot be undone.`
      )
    )
      return;
    console.log("Deleting trip:", trip._id);
    try {
      fetch(`/api/trips/${trip._id}`, {
        method: "DELETE",
      }).then((res) => {
        if (res.ok) {
          setTrips((prev) => prev.filter((t) => t._id !== trip._id));
        } else {
          console.error("Failed to delete trip");
        }
      });
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  // Get list of visited states from trips
  const visitedStates = getVisitedStates(trips);
  console.log("Visited states:", visitedStates); // DEBUG

  const filteredTrips = useMemo(() => {
    let t = [...trips];

    if (sortFilter === "latest") {
      t.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (sortFilter === "earliest") {
      t.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sortFilter === "highestExpense") {
      t.sort((a, b) => getTotalExpense(b) - getTotalExpense(a));
    } else if (sortFilter === "lowestExpense") {
      t.sort((a, b) => getTotalExpense(a) - getTotalExpense(b));
    }
    if (maxExpense !== "") {
      t = t.filter((trip) => getTotalExpense(trip) <= Number(maxExpense));
    }
    if (stateFilter !== "") {
      t = t.filter((trip) =>
        trip.legs?.some((leg) => leg.state === stateFilter)
      );
    }

    return t;
  }, [trips, sortFilter, maxExpense, stateFilter]);

  const resetFilters = () => {
    setSortFilter("none");
    setMaxExpense("");
    setStateFilter("");
  };

  return (
    <div className="trip-page container my-4">
      <h1 className="mb-4">My Trips</h1>

      {/* SVG Map Component */}
      <div className="mb-4">
        <USMap visitedStates={visitedStates} />
      </div>

      {/* Trip Stats Component */}
      <TripStats trips={trips} visitedStates={visitedStates} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Button to open Trip Form Modal */}
        <Button
          className="btn btn-add-trip"
          variant="primary"
          onClick={() => {
            setSelectedTrip(null);
            setShowTripForm(true);
          }}
        >
          + Add New Trip
        </Button>

        {/* Trip Form Modal */}
        <TripFormModal
          show={showTripForm}
          onHide={() => setShowTripForm(false)}
          onSave={handleSaveTrip}
          initialData={selectedTrip}
        />

        {/* Trip Filters Component */}
        <TripFilters
          sortFilter={sortFilter}
          maxExpense={maxExpense}
          onSortChange={setSortFilter}
          onMaxExpenseChange={setMaxExpense}
          stateFilter={stateFilter}
          states={visitedStates}
          onStateFilterChange={setStateFilter}
          onReset={resetFilters}
        />
      </div>

      {/* Trip Accordion Component */}
      <div className="mt-4">
        <TripAccordion
          trips={filteredTrips}
          onEdit={handleEditTrip}
          onDelete={handleDeleteTrip}
        />
      </div>
    </div>
  );
}
