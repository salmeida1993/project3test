import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const nav = useNavigate();
  const { register, setErr, err } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      nav("/account");
    } catch (ex) {
      alert(ex?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>Create account</h2>
      {err && <p className="error">{err}</p>}
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            minLength={6}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <button disabled={busy} type="submit">
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
