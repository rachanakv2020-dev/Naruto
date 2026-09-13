import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

function LoginPage() {
  const [form, setForm] = useState({ email: "admin@leafvillage.com", password: "admin123" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/auth/login", form);
      localStorage.setItem("leaf_admin_token", response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-login-card">
        <div className="admin-login-copy">
          <span className="admin-kicker">Admin access</span>
          <h1>Leaf Village Console</h1>
          <p>Monitor orders, manage menu items, and keep the village running smoothly.</p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="admin-primary-button" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
