import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import Submission from "./pages/Submission";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import RouteLoader from "./components/RouteLoader";

/**
 * TransitionManager — Listens for route changes and shows the loader.
 */
function TransitionManager({ children }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start loading on path change
    setIsLoading(true);

    // Fixed 3 second delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <RouteLoader />}
      {/* 
          We keep the children rendered but only visible when not loading.
          This ensures hooks/redirects inside pages can still run in the background.
      */}
      <div className={isLoading ? "invisible h-0 overflow-hidden" : "visible"}>
        {children}
      </div>
    </>
  );
}

/**
 * App — root routing component.
 *
 * Routes:
 *   /               → redirect to /login
 *   /login          → Login page (public)
 *   /signup         → Signup page (public)
 *   /problems       → Problem list (auth required)
 *   /problems/:id   → Problem detail + code editor (auth required)
 *   /submission/:id → Submission detail view (auth required)
 *   *               → 404 redirect to /login
 */
function App() {
  return (
    <BrowserRouter>
      <TransitionManager>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems"
            element={
              <ProtectedRoute>
                <Problems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problems/:id"
            element={
              <ProtectedRoute>
                <ProblemDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submission/:submissionId"
            element={
              <ProtectedRoute>
                <Submission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </TransitionManager>
    </BrowserRouter>
  );
}

export default App;
