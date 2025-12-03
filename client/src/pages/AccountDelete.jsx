import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AccountDelete() {
  const { user, deleteMe } = useAuth();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const nav = useNavigate();

  if (!user)
    return (
      <p className="card" style={{ margin: "2rem" }}>
        You must be signed in.
      </p>
    );

  const onDelete = async () => {
    if (confirmText !== user.email)
      return alert("Type your email exactly to confirm.");
    setDeleting(true);
    try {
      await deleteMe();
      nav("/");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h2>Delete account</h2>
      <p>This permanently deletes your account.</p>
      <p>
        To confirm, type your email: <strong>{user.email}</strong>
      </p>
      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="Type your email to confirm"
      />
      <button className="danger" disabled={deleting} onClick={onDelete}>
        {deleting ? "Deleting…" : "Delete my account"}
      </button>
    </div>
  );
}
