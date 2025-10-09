import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Card = ({ image }) => {
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
  return (
    <div
      className={`w-[160px] h-[200px] bg-black border-2 border-[#7700ff84]  rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-pink-900 cursor-pointer hover:border-white transition duration-150 ease-in-out
        ${selectedImage === image ? "border-white border-2 " : null}
   `}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} className=" h-full object-cover w-full " />
    </div>
  );
};

export default Card;
