// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* SINGLE ToastContainer at app root — never unmounts */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />

      <App />
      </GoogleOAuthProvider>
    </>
  // </StrictMode>
);
