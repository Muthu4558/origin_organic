// src/components/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const API_VERIFY = `${import.meta.env.VITE_APP_BASE_URL}/api/auth/verify`;

const PrivateRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      // Try server-side verification first
      try {
        const res = await fetch(API_VERIFY, {
          method: "GET",
          credentials: "include", // important if your auth uses httpOnly cookies
        });

        if (!mounted) return;

        if (res.status === 200) {
          // If server returns JSON with isAdmin flag, read it
          try {
            const data = await res.json();
            setIsAdmin(!!data?.isAdmin);
            localStorage.setItem("isAdmin", data?.isAdmin ? "true" : "false");
          } catch {
            // If no JSON or parse fails, don't crash — keep isAdmin false
          }
          setIsAuthed(true);
          setChecking(false);
          return;
        }

        // If server returns 401 or other, treat as not authenticated
        if (res.status === 401) {
          setIsAuthed(false);
          setChecking(false);
          return;
        }

        // For other statuses, fall through to token fallback
      } catch (err) {
        // network / CORS / endpoint missing -> we'll fallback to token check below
        // console.warn("Verify endpoint failed, falling back to token check.", err);
      }

      // Fallback: client-side token check (best-effort)
      const token = localStorage.getItem("token");
      const adminFlag = localStorage.getItem("isAdmin") === "true";
      setIsAdmin(adminFlag);
      setIsAuthed(!!token);
      setChecking(false);
    };

    verify();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // while verifying, show a small spinner / placeholder so protected pages don't flash
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div role="status" aria-live="polite" className="text-center p-4">
          <svg className="animate-spin h-8 w-8 mx-auto mb-2" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <div className="text-sm text-gray-600">Checking authentication…</div>
        </div>
      </div>
    );
  }

  // not authenticated -> redirect to login and preserve original location
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // admin routes blocked for non-admins
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // authorized
  return children;
};

export default PrivateRoute;
