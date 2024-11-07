import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { SignupProvider } from "./utils/SignupContext.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import Analysis from "./components/Analysis.jsx";
import History from "./pages/History.jsx";
import Setting from "./components/Setting.jsx";
import Question1 from "./pages/Question1.jsx";
import Question2 from "./pages/Question2.jsx";
import VisitorPage from "./pages/VisitorPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";  // Import ProtectedRoute

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user ID and email in local storage
    const userId = localStorage.getItem("UserId");
    const userEmail = localStorage.getItem("UserMail");

    // If both user ID and email exist, redirect to home
    if (userId && userEmail) {
      navigate("/home");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<VisitorPage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/question1" element={<Question1 />} />
      <Route path="/signup/question2" element={<Question2 />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setting"
        element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Wrap the App component in BrowserRouter
function Root() {
  return (
    <BrowserRouter>
      <SignupProvider>
        <App />
      </SignupProvider>
    </BrowserRouter>
  );
}

export default Root;
