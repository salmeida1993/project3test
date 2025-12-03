import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import states from "../data/states.json";

function getStateByCode(code) {
  const c = String(code || "").toUpperCase();
  return states.find((s) => s.code === c) || null;
}

function buildCandidates(code) {
  const lower = String(code).toLowerCase();
  return [
    `/state-photos/${lower}.jpg`,
    `/state-photos/${lower}.jpeg`,
    `/state-photos/${lower}.png`,
    `/state-photos/fallback.jpg`,
    `/state-photos/fallback.jpeg`,
    `/state-photos/fallback.png`,
  ];
}

export default function StateDetail() {
  const { code } = useParams();
  const state = useMemo(() => getStateByCode(code), [code]);

  // --- image handling
  const [idx, setIdx] = useState(0);
  const candidates = state ? buildCandidates(state.code) : [];

  // --- notes handling (Save button, not autosave)
  const storageKey = state ? `stateNotes:${state.code}` : null;
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [banner, setBanner] = useState(""); // transient status text

  // Load saved notes when state changes
  useEffect(() => {
    if (!storageKey) return;
    const raw = localStorage.getItem(storageKey);
    const payload = raw ? JSON.parse(raw) : { notes: "", savedAt: null };
    setNotes(payload.notes || "");
    setSavedNotes(payload.notes || "");
    setLastSavedAt(payload.savedAt ? new Date(payload.savedAt) : null);
    setBanner("");
  }, [storageKey]);

  function handleSave() {
    if (!storageKey) return;
    const payload = { notes, savedAt: new Date().toISOString() };
    localStorage.setItem(storageKey, JSON.stringify(payload));
    setSavedNotes(notes);
    setLastSavedAt(new Date(payload.savedAt));
    setBanner("Saved!");
    // clear banner after a moment
    window.clearTimeout(handleSave._t);
    handleSave._t = window.setTimeout(() => setBanner(""), 1500);
  }

  function handleDiscard() {
    setNotes(savedNotes);
    setBanner("Changes discarded");
    window.clearTimeout(handleDiscard._t);
    handleDiscard._t = window.setTimeout(() => setBanner(""), 1500);
  }

  const isDirty = notes !== savedNotes;

  if (!state) {
    return (
      <div className="card" style={{ marginTop: 16 }}>
        <p>State not found.</p>
        <p><Link to="/states">Back to all states</Link></p>
      </div>
    );
  }

  const src = candidates[idx];

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <p><Link to="/states">← Back to all states</Link></p>

      <header>
        <h1 style={{ margin: "0 0 8px" }}>
          {state.name} <span style={{ opacity: 0.7 }}>({state.code})</span>
        </h1>
        <div style={{ color: "var(--muted)" }}>
          Capital: <strong>{state.capital}</strong> · Region: <strong>{state.region}</strong>
          {state.nickname ? <> · Nickname: <strong>{state.nickname}</strong></> : null}
        </div>
      </header>

      <img
        src={src}
        alt={`${state.name} representative`}
        className="state-hero"
        loading="lazy"
        onError={() => {
          if (idx < candidates.length - 1) setIdx((i) => i + 1);
        }}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: 420,
          objectFit: "cover",
          borderRadius: 12,
          border: "1px solid var(--border, #2b3142)",
          marginTop: 12,
        }}
      />

      <section>
        <h2 style={{ marginTop: 16 }}>About {state.name}</h2>
        <p className="help">Add quick facts, links, or your own notes here.</p>

        {/* Notes Textarea + Controls */}
        <label htmlFor="state-notes" style={{ display: "block", fontWeight: 600, margin: "12px 0 6px" }}>
          Your notes for {state.name}
        </label>
        <textarea
          id="state-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={8}
          placeholder={`Write anything you want to remember about ${state.name}…`}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid var(--border, #2b3142)",
            background: "var(--panel, #0f1425)",
            color: "inherit",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
          <button
            onClick={handleSave}
            disabled={!isDirty}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--border, #2b3142)",
              background: isDirty ? "var(--accent, #4f46e5)" : "var(--panel, #0f1425)",
              color: isDirty ? "#fff" : "var(--muted, #9aa4b2)",
              cursor: isDirty ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
            aria-disabled={!isDirty}
          >
            Save
          </button>

          <button
            onClick={handleDiscard}
            disabled={!isDirty}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--border, #2b3142)",
              background: "transparent",
              color: isDirty ? "inherit" : "var(--muted, #9aa4b2)",
              cursor: isDirty ? "pointer" : "not-allowed",
              fontWeight: 500,
            }}
            aria-disabled={!isDirty}
          >
            Discard changes
          </button>

          <span role="status" aria-live="polite" style={{ marginLeft: 8, color: "var(--muted)" }}>
            {banner || (lastSavedAt
              ? `Last saved ${lastSavedAt.toLocaleString()}`
              : "Not saved yet")}
          </span>
        </div>
      </section>
    </div>
  );
}
