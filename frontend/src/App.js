import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Home from "./pages/home";
import Menu from "./pages/Menu";
import BirthdayCakes from "./pages/Birthdaycake";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CupCakes from "./pages/cupcake";
import AnniversaryCakes from "./pages/anniversarycake";
import WeddingStructures from "./pages/weddingStructure";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CakeManager from "./pages/CakeManager";
import UploadCakePage from "./pages/UploardCakePage";
import OrderForm from "./pages/OrderForm";
import OrdersDashboard from "./pages/OrdersDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import ReviewsPage from "./pages/ReviewsPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/birthdaycake" element={<BirthdayCakes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cupcake" element={<CupCakes />} />
          <Route path="/anniversarycake" element={<AnniversaryCakes />} />
          <Route path="/weddingStructures" element={<WeddingStructures />} />
          <Route path="/login" element={<LoginPage setToken={setToken} />} />
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/manage" element={<CakeManager />} />
          <Route path="/update" element={<UploadCakePage />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/orders" element={<OrdersDashboard />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
