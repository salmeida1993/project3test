import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AccountEdit() {
  const { user, updateMe, err, setErr } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState("");

  // Load user info into form
  useEffect(() => {
    setErr("");
    setInfo("");
    if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user, setErr]);

  if (!user) {
    return (
      <p className="card" style={{ margin: "2rem" }}>
        You must be signed in.
      </p>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setInfo("");

    const patch = {};
    const newName = form.name.trim();
    const newEmail = form.email.trim();

    if (newName && newName !== user.name) patch.name = newName;
    if (newEmail && newEmail !== user.email) patch.email = newEmail;

    try {
      const updated = await updateMe(patch);
      if (updated) {
        setInfo(
          Object.keys(patch).length
            ? "Account updated successfully."
            : "No changes to save."
        );
        // Refresh form fields with latest user from server
        setForm({ name: updated.name || "", email: updated.email || "" });
      }
    } catch (e2) {
      // Handle known errors
      if (e2.status === 409) {
        alert("That email is already registered.");
      } else if (e2.status === 401) {
        alert("Your session expired. Please sign in again.");
      } else {
        alert(e2?.message || "Update failed. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h2>Edit Account</h2>

      {info && (
        <p className="info" style={{ color: "green" }}>
          {info}
        </p>
      )}
      {err && (
        <p className="error" style={{ color: "red" }}>
          {err}
        </p>
      )}

      <form onSubmit={onSubmit}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        <button
          disabled={saving}
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: saving ? "#888" : "#0077cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: saving ? "default" : "pointer",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
