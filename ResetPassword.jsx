import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "./authlayout.jsx";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:5000/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();
    alert(data.message);

    if (res.ok) navigate("/login");
  };

  return (
    <AuthLayout title="Reset Password">
      <form className="auth-form" onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="auth-btn">Reset Password</button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
