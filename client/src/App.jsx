import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import AccountEdit from "./pages/AccountEdit.jsx";
import AccountDelete from "./pages/AccountDelete.jsx";
import StateIndex from "./pages/StateIndex.jsx";
import StateDetail from "./pages/StateDetail.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Visited from "./pages/Visited.jsx";
import Trip from "./pages/Trip.jsx";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="site-header">
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/states">States</Link>
          {user && <Link to="/visited">Visited</Link>}
          {user && <Link to="/trip">My Trips</Link>}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          {user && <Link to="/account">Account</Link>}
          {user && (
            <button onClick={logout} className="linklike">
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="container">
        <Routes>
          {/* Home now renders the Home page component */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/edit"
            element={
              <ProtectedRoute>
                <AccountEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/delete"
            element={
              <ProtectedRoute>
                <AccountDelete />
              </ProtectedRoute>
            }
          />

          <Route path="/states" element={<StateIndex />} />
          <Route path="/states/:code" element={<StateDetail />} />

          <Route
            path="/visited"
            element={
              <ProtectedRoute>
                <Visited />
              </ProtectedRoute>
            }
          />
          <Route
            path="/visited"
            element={
              <ProtectedRoute>
                <Visited />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trip"
            element={
              <ProtectedRoute>
                <Trip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip"
            element={
              <ProtectedRoute>
                <Trip />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}
