import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

export default function LoginPage({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/owner/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken?.(res.data.token);
      navigate("/menu");
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div className="login-page">

  <main className="login-main">
    <form onSubmit={handleLogin} className="login-form">
      <h2>Owner Login</h2>
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
      <button type="submit">Login</button>
    </form>
  </main>
</div>

  );
}
