import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "../src/pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
