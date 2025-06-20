import "./App.css";
import Navbar from "./component/Navbar";
import home from "./pages/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
        
          <Route path="/" exact Component={home} />
       
        </Routes>
      </Router>
    </div>
  );
}

export default App;
