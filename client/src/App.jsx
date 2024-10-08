import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./App.css";
import { SignupProvider } from "./utils/SignupContext.jsx";
import Home from "../src/pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import Analysis from "./components/Analysis.jsx";
import History from "./components/History.jsx";
import Setting from "./components/Setting.jsx";
import Question1 from "./pages/Question1.jsx";
import Question2 from "./pages/Question2.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <SignupProvider>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/question1" element={<Question1 />} />
            <Route path="/signup/question2" element={<Question2 />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/history" element={<History />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </SignupProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
