import { useState } from "react";

const API_BASE_URL = "http://localhost:4000/api";

function RegisterForm({ onRegistered, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // direct login after register
      onRegistered(data.token, data.user);
    } catch {
      setError("Network error");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Join Sweet Shop</h1>
          <p>Create your account to start buying your favourite sweets.</p>
        </div>

        <div className="auth-right">
          <h2>Register</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label>
              Confirm password
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="primary-btn full-width">
              Create account
            </button>

            {error && <p className="error-text">{error}</p>}
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <button
              type="button"
              className="secondary-btn small"
              onClick={onCancel}
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
