import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Load session on mount
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const me = await api("/users/me");
        if (!cancel) setUser(me.user || null);
      } catch {
        if (!cancel) setUser(null);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  // Auth actions
  const login = async (email, password) => {
    setErr("");
    const r = await api("/auth/login", { method: "POST", data: { email, password } });
    setUser(r.user);
    return r.user;
  };

  const register = async (name, email, password) => {
    setErr("");
    const r = await api("/auth/register", { method: "POST", data: { name, email, password } });
    setUser(r.user);
    return r.user;
  };

  const logout = async () => {
    setErr("");
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  };

  const updateMe = async (patch) => {
    try {
      const r = await api("/users/me", { method: "PATCH", data: patch });
      setUser(r.user);
      return r.user;
    } catch (e) {
      // If cookie is stale, server returns 401 → clear UI state
      setUser(null);
      throw e;
    }
  };

  const deleteMe = async () => {
    await api("/users/me", { method: "DELETE" });
    setUser(null);
  };

  // Visited states helpers (safe if not used)
  const loadVisited = async () => {
    const r = await api("/users/me/visited");
    return r.visitedStates || [];
  };

  const saveVisited = async (visitedStates) => {
    const r = await api("/users/me/visited", {
      method: "PUT",
      data: { visitedStates },
    });
    return r.visitedStates || [];
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        err,
        setErr,
        login,
        register,
        logout,
        updateMe,
        deleteMe,
        loadVisited,
        saveVisited,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
