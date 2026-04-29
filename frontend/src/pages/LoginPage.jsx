import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";
import homee from "../assets/homee.jpg";
import { getApiBaseUrl } from "../helpers/apiBaseUrl";


export default function LoginPage({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiBaseUrl = getApiBaseUrl();
      const res = await axios.post(`${apiBaseUrl}/api/owner/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setToken?.(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err);
      const message = err.response?.data?.message || err.response?.data?.error || "Invalid login";
      alert(message);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${homee})` }}>

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
