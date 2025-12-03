import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Account() {
  const { user } = useAuth();
  if (!user)
    return (
      <p className="card" style={{ margin: "2rem" }}>
        You are not signed in.
      </p>
    );
  return (
    <div className="card" style={{ maxWidth: 640, margin: "2rem auto" }}>
      <h2>My Account</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <Link to="/account/edit" className="button">
          Edit
        </Link>
        <Link to="/account/delete" className="button danger">
          Delete
        </Link>
      </div>
    </div>
  );
}
