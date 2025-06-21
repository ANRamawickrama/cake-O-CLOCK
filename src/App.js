import "./App.css";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import home from "./pages/home";
import Menu from "./pages/Menu";
import BirthdayCakes  from "./pages/Birthdaycake";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact Component={home} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/birthdaycake" element={<BirthdayCakes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
