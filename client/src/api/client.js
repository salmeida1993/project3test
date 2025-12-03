const API_BASE = import.meta.env.VITE_API_BASE || ""; // empty in dev to use proxy

export async function api(path, { method = "GET", data } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    try {
      const msg = await res.json();
      err.message = msg.message || err.message;
    } catch {
      // ignore
    }
    throw err;
  }

  return res.json();
}
