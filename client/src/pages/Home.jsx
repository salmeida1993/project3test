import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();

  return (
    <section className="home">
      <div className="home-hero">
        <h1 className="home-title">Plan. Explore. Remember.</h1>
        <p className="home-subtitle">
          Track the states you’ve visited, map your next trip, and keep all your travel memories in one place.
        </p>

        <div className="home-cta">
          <Link className="btn btn-lg primary" to="/states">Browse States</Link>
          {user ? (
            <>
              <Link className="btn btn-lg" to="/visited">My Visited</Link>
              <Link className="btn btn-lg" to="/trip">Plan a Trip</Link>
            </>
          ) : (
            <>
              <Link className="btn btn-lg" to="/register">Create Account</Link>
              <Link className="btn btn-lg" to="/login">Sign In</Link>
            </>
          )}
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>Interactive Map</h3>
          <p>Click any state to see highlights and add it to your travel history.</p>
        </div>
        <div className="feature-card">
          <h3>Trip Tracker</h3>
          <p>Plan multi-city routes, dates, budgets, and notes—keep it all organized.</p>
        </div>

      </div>

      <div className="home-tip">
        <span className="tip-badge">Tip</span>
        <p>Already traveling? Head to <Link to="/trip">Trips</Link> to add stops and track expenses.</p>
      </div>
    </section>
  );
}
