// SignupContext.js
import React, { createContext, useState, useContext } from "react";

// Create the context
const SignupContext = createContext();

// Create a provider component
export function SignupProvider({ children }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    mobile_no: "+91",
    date_of_birth: "",
    category: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false); // State to manage button click feedback

  // Handler functions
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile_no" && !/^\+91\d{0,10}$/.test(value)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClear = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      name: "",
      mobile_no: "+91",
      date_of_birth: "",
      category: "",
    });
    setResponseMessage("");
    setResponseType("");
  };

  return (
    <SignupContext.Provider
      value={{
        formData,
        setFormData,
        responseMessage,
        setResponseMessage,
        responseType,
        setResponseType,
        loading,
        setLoading,
        handleChange,
        handleClear,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
}

// Custom hook for using context
export function useSignupContext() {
  return useContext(SignupContext);
}
