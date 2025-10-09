import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import authImg from "../assets/auth.jpg";
import { IoChevronBackCircle } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      setLoading(false);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
  className="w-full min-h-screen flex flex-col justify-center bg-cover items-center px-4 md:px-8 lg:px-12"
  style={{ backgroundImage: `url(${authImg})` }}
>
  <IoChevronBackCircle
    className="absolute text-3xl md:text-4xl lg:text-5xl top-6 left-6 md:top-8 md:left-8 bg-transparent cursor-pointer hover:text-white transition-colors duration-300"
    onClick={() => navigate("/customize")}
  />
  <div
    className="
      w-full max-w-[500px]
      min-h-[450px] md:min-h-[500px]
      p-6 md:p-10
      rounded-3xl 
      flex flex-col justify-center items-center gap-6
      bg-[#2a2a2c48] text-white backdrop-blur-md
      shadow-2xl shadow-black
      mt-20 md:mt-0
      transition-all duration-300
    "
  >
    <h1
      className="
        text-2xl md:text-3xl lg:text-4xl
        font-bold text-white 
        mb-8 md:mb-10
        text-center
        transition-all duration-300
      "
    >
      Select Your{" "}
      <span className="text-[#15a7d3] font-[techy] hover:text-[#0d8bb3] transition-colors duration-300">
        Virtual_Assistant
      </span>{" "}
      Name
    </h1>
    <input
      type="text"
      placeholder="eg: jarvis"
      className="
        w-full 
        h-14 
        px-6 
        rounded-lg 
        border-2 
        border-gray-300 
        focus:outline-none 
        focus:border-blue-500 
        text-white 
        bg-transparent
        text-lg
        transition-all 
        duration-300
        hover:border-blue-300
      "
      onChange={(e) => setAssistantName(e.target.value)}
      value={assistantName}
    />
    {assistantName && (
      <button
        type="submit"
        className="
          relative 
          p-[3px] 
          cursor-pointer 
          w-full md:w-auto 
          mt-8 md:mt-10
          transform hover:scale-105
          transition-all 
          duration-300
        "
        onClick={() => {
          handleUpdateAssistant();
        }}
        disabled={loading || !assistantName}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-gradient" />
        <div className="
          relative 
          px-8 md:px-12
          py-3 
          bg-black 
          rounded-full 
          transition-all 
          duration-300 
          text-white 
          hover:bg-transparent 
          text-center
          text-lg
        ">
          {!loading ? "let's Go 🚀" : "Loading..."}
        </div>
      </button>
    )}
  </div>
</div>  );
};

export default Customize2;
