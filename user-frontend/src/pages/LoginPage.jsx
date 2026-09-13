import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/auth/login", form);
      setUser(response.data.user);
      setToken(response.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <section className="auth-page">
      <div className="container auth-card glass-card">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h1>Login to your account</h1>
          <p>Continue your Hidden Leaf food journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-button width-full" type="submit">Login</button>

          <p className="alternate-action">
            Need an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
