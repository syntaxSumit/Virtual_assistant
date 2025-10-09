import React, { useContext, useRef, useState } from "react";
import { IoChevronBackCircle } from "react-icons/io5";
import authImg from "../assets/auth.jpg";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col bg-cover justify-center overflow-hidden items-center p-4 md:p-8 lg:p-12"
      style={{ backgroundImage: `url(${authImg})` }}
    >
      <IoChevronBackCircle
        className="absolute text-3xl sm:text-4xl md:text-5xl top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 bg-transparent cursor-pointer hover:text-white transition-colors duration-300"
        onClick={() => navigate("/")}
      />
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 md:mb-12 lg:mb-16 text-center tracking-wide">
        Select Your Virtual Assistant
      </h1>
      <div className="w-full max-w-7xl flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-10 px-2 md:px-4 lg:px-6">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <div
          className={`w-[160px] h-[200px] sm:w-[180px] sm:h-[220px] md:w-[200px] md:h-[240px] bg-black border-2 border-[#7700ff84] rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-pink-900 cursor-pointer text-white hover:border-white transition-all duration-300 ease-in-out flex items-center gap-4 justify-center transform hover:scale-105 ${
            selectedImage === "input" ? "border-white border-3 scale-105" : null
          }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <MdOutlineAddPhotoAlternate className="text-4xl md:text-5xl transition-transform hover:rotate-12" />
          )}
          {frontendImage && (
            <img
              src={frontendImage}
              alt="selected"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <button
          type="submit"
          className="relative p-[3px] cursor-pointer w-full sm:w-auto mt-12 md:mt-16 lg:mt-20 max-w-md transform hover:scale-105 transition-all duration-300"
          onClick={() => navigate("/customize2")}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-gradient" />
          <div className="relative px-8 sm:px-12 py-3 bg-black rounded-full transition duration-300 text-white hover:bg-transparent text-center text-lg md:text-xl font-semibold">
            Next
          </div>
        </button>
      )}
    </div>
  );
};

export default Customize;
