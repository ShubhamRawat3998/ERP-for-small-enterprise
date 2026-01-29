import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./authlayout.jsx";
import {Link } from "react-router-dom";
import "./auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      sessionStorage.setItem("token", data.token);
      console.log("Token saved:", sessionStorage.getItem("token"));

      navigate("/app"); // ✅ FIXED
    } catch (err) {
      console.error("Login error:", err);
      alert("Backend server not running");
    }
  };

  return (
    <AuthLayout title="Login">
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link to="/forgot-password" className="link-btn">Forgot Password?</Link>
        <Link to="/signup" className="link-btn">Sign Up</Link>
        <button className="auth-btn" type="submit">Login</button>
      </form>
    </AuthLayout>
  );
}

export default Login;
