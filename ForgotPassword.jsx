import { useState } from "react";
import AuthLayout from "./authlayout.jsx";
import "./auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <AuthLayout title="Forgot Password">
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter registered email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="auth-btn">Send Reset Link</button>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
