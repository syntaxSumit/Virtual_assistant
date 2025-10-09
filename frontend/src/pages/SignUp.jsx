import React, { useContext, useState } from "react";
import bg from "../assets/authBg.jpg";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";
import axios from "axios";


const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signUp`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative rounded-3xl bg-[#2a2a2c48] text-white backdrop-blur-sm shadow-2xl shadow-black flex flex-col items-center gap-4 sm:gap-5 px-5 sm:px-8 py-8 sm:py-10"
      >
        <h1 className="absolute top-4 sm:top-5 text-[18px] sm:text-[20px] font-bold">
          Register to&nbsp;
          <span className="text-[#15a7d3] font-[techy]">Virtual_Assistant</span>
        </h1>

        <div className="h-10" />

        <input
          type="text"
          placeholder="Enter Your Name"
          className="w-full h-[48px] sm:h-[50px] outline-none text-[15px] border-2 border-white/80 bg-transparent px-5 placeholder-gray-200 rounded-full transition duration-150 ease-in-out hover:scale-[1.01] focus:border-white"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full h-[48px] sm:h-[50px] outline-none text-[15px] border-2 border-white/80 bg-transparent px-5 placeholder-gray-200 rounded-full transition duration-150 ease-in-out hover:scale-[1.01] focus:border-white"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="w-full relative h-[48px] sm:h-[50px] border-2 border-white/80 bg-transparent text-white rounded-full text-[16px]">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full outline-none bg-transparent px-5 placeholder-gray-200 transition duration-150 ease-in-out hover:scale-[1.01] focus:border-none"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword ? (
            <FaEyeSlash
              className="absolute top-2.5 sm:top-3 right-4 cursor-pointer w-[22px] h-[22px] text-white"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <FaEye
              className="absolute top-2.5 sm:top-3 right-4 cursor-pointer w-[22px] h-[22px] text-white"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        {err.length > 0 && <p className="text-red-600">*{err}</p>}
        <button
          type="submit"
          className="relative p-[3px] cursor-pointer w-full sm:w-auto"
          disabled={loading}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          <div className="relative px-6 sm:px-8 py-2 bg-black rounded-full transition duration-200 text-white hover:bg-transparent text-center">
            {loading ? "Loading..." : "SignUp"}
          </div>
        </button>

        <p
          className="text-[16px] sm:text-[18px] mt-1"
          onClick={() => navigate("/signin")}
        >
          Already have an account?&nbsp;
          <span className="text-blue-300 cursor-pointer hover:text-blue-50">
            SignIn
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
