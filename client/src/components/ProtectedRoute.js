// ProtectedRoute.js
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("UserMail");

    return isAuthenticated ? children : navigate("/signin")
};

export default ProtectedRoute;
