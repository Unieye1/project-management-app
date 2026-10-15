import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/me",
          {
            credentials: "include",
          }
        );

        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <p className="p-8">Checking your session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}