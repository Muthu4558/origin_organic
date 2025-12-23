import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/verify-email/${token}`)
      .then(() => {
        toast.success("Email verified! You can login now.");
        navigate("/login");
      })
      .catch(() => {
        toast.error("Invalid or expired verification link");
      });
  }, [token, navigate]);

  return null;
};

export default VerifyEmail;
