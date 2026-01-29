import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./authlayout.jsx";
import "./auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Signup successful");
    navigate("/login");
  };

  return (
    <AuthLayout title="Sign Up">
      <form className="auth-form" onSubmit={handleSignup}>
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button className="auth-btn">Sign Up</button>
        <Link to="/login" className="link-btn">Already have an account?</Link>
      </form>
    </AuthLayout>
  );
}

export default Signup;
