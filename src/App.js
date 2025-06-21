import "./App.css";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import home from "./pages/home";
import Menu from "./pages/Menu";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact Component={home} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
