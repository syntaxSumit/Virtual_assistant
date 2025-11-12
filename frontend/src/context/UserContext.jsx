import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

const userContext = ({ children }) => {
  const serverUrl = "https://virtualassitant-backend.onrender.com";
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("✅ User data loaded:", result.data);
    } catch (error) {
      console.error("❌ User fetch error:", error);
    }
  };

  // ✅ FIX: Function ko useEffect se pehle define karo
  const getGeminiResponse = async (command) => {
    try {
      console.log("🤖 Sending to backend:", command);
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      console.log("✅ Backend response:", result.data);
      return result.data;
    } catch (error) {
      console.error("❌ Gemini API error:", error);
      return null; // ✅ FIX: Return null on error
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default userContext;
