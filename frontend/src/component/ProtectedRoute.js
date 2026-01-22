import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      setIsChecking(true);
      const token = localStorage.getItem("token");

      // If no token, redirect to login immediately
      if (!token) {
        setIsAuthenticated(false);
        setIsChecking(false);
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Verify token with backend
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const response = await axios.get(`${API_URL}/api/verify`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        });
        
        if (response.status === 200) {
          setIsAuthenticated(true);
          setIsChecking(false);
        } else {
          throw new Error("Token verification failed");
        }
      } catch (error) {
        // Token is invalid, expired, or backend unreachable
        console.error("Token verification failed:", error.message);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsChecking(false);
        navigate("/login", { replace: true });
      }
    };

    verifyToken();
  }, [navigate]);

  // Show loading state while checking authentication
  if (isChecking || isAuthenticated === null) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        flexDirection: "column",
        gap: "10px"
      }}>
        <div style={{ animation: "spin 1s linear infinite" }}>🔒</div>
        Verifying access...
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render the protected page
  return children;
}
