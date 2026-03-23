import { createContext, useState, useContext, useCallback } from "react";

// Create context
export const AuthContext = createContext();

/**
 * AuthProvider — wraps the entire app to supply auth state.
 * Persists token + user data to localStorage for page refreshes.
 */
export const AuthProvider = ({ children }) => {
  // Restore both token AND user from localStorage on first mount
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  /**
   * Called after a successful login / register.
   * Stores the JWT and user object in state + localStorage.
   */
  const login = useCallback((newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  /**
   * Clears all auth state and localStorage entries.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Convenience hook — throws if used outside AuthProvider.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
