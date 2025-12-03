import React, { useEffect, useState } from "react";
import UsVisitedMap from "../components/UsVisitedMap.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Visited() {
  const { loadVisited, saveVisited } = useAuth();
  const [visited, setVisited] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const arr = await loadVisited();
        if (!cancel) setVisited(arr);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancel = true;
    };
  }, [loadVisited]);

  const toggle = (code) => {
    setVisited((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const onSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      const arr = await saveVisited(visited);
      setVisited(arr);
      setMsg("Visited states saved!");
    } catch (e) {
      setMsg(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Visited States</h2>
      {msg && <p>{msg}</p>}
      <UsVisitedMap visited={visited} onToggle={toggle} />
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <span>Visited: {visited.length} / 51</span>
      </div>
    </div>
  );
}
