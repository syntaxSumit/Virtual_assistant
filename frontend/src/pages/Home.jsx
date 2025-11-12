import React, { useContext } from "react";
import aiImg from "../assets/ai-unscreen.gif";
import authImg from "../assets/auth.jpg";
import userImg from "../assets/user.gif";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  // State variables
  const [listning, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");

  // Refs
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);

  const synth = window.speechSynthesis;

  // ========== LOGOUT ==========
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  // ========== SAFE START ==========
  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  // ========== SPEAK ==========
  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "hi-IN";

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    // ✅ FIX: Pause recognition during speech
    if (recognitionRef.current) {
      recognitionRef.current.shouldAutoRestart = false;
    }

    isSpeakingRef.current = true;

    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;

      // ✅ FIX: Re-enable and restart after speech
      const rec = recognitionRef.current;
      if (rec) {
        rec.shouldAutoRestart = true;
        setTimeout(() => {
          startRecognition();
        }, 800);
      }
    };

    synth.cancel();
    synth.speak(utterence);
  };

  // ========== COMMAND HANDLER ==========
  const handleCommand = (data) => {
    if (!data) return;
    const { type, userInput, response } = data;

    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "youtube_search") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "wikipedia_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank");
    }

    if (type === "news_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://news.google.com/search?q=${query}`, "_blank");
    }

    if (type === "weather") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }

    if (type === "joke") {
      window.open(`https://www.google.com/search?q=random+joke`, "_blank");
    }

    if (type === "quote") {
      window.open(`https://www.google.com/search?q=random+quote`, "_blank");
    }

    if (type === "advice") {
      window.open(`https://www.google.com/search?q=random+advice`, "_blank");
    }

    if (type === "note_taking") {
      navigate("/notes");
    }

    if (type === "currency_conversion") {
      window.open(`https://www.xe.com/currencyconverter/`, "_blank");
    }

    if (type === "unit_conversion") {
      window.open(`https://www.google.com/search?q=unit+converter`, "_blank");
    }

    if (type === "translation") {
      window.open(`https://translate.google.com/`, "_blank");
    }

    if (type === "email_management") {
      window.open(`https://mail.google.com/`, "_blank");
    }

    if (type === "contact_lookup") {
      window.open(`https://contacts.google.com/`, "_blank");
    }

    if (type === "task_management") {
      window.open(`https://tasks.google.com/`, "_blank");
    }

    if (type === "calendar_event") {
      window.open(`https://calendar.google.com/`, "_blank");
    }

    if (type === "reminder" || type === "alarm" || type === "timer") {
      window.open(`https://www.google.com/search?q=${type}`, "_blank");
    }

    if (type === "youtube_open") {
      window.open(`https://www.youtube.com/`, "_blank");
    }

    if (
      type === "defination" ||
      type === "synonym" ||
      type === "antonym" ||
      type === "spell_check" ||
      type === "grammar_check" ||
      type === "math"
    ) {
      window.open(`https://www.google.com/search?q=${userInput}`, "_blank");
    }
  };

  // ========== SPEECH RECOGNITION SETUP ==========
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("❌ Speech Recognition not supported");
      alert("Please use Chrome browser for voice features");
      return;
    }

    const recognition = new SpeechRecognition();

    // Settings
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    // ✅ FIX: Control flags on instance
    recognition.shouldAutoRestart = true;
    recognition.restarting = false;
    recognition.lastRestartAt = 0;

    recognitionRef.current = recognition;

    // ✅ FIX: Single initial start
    const initialTimer = setTimeout(() => {
      console.log("🎯 Starting recognition...");
      startRecognition();
    }, 800);

    // ========== ONSTART ==========
    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("✅ Recognition ACTIVE");
      console.log("🎤 Say:", userData?.assistantName || "assistant name");
    };

    // ========== ONEND ==========
    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (!recognition.shouldAutoRestart) {
        return;
      }

      const now = Date.now();
      const COOLDOWN = 1000;

      if (recognition.restarting || now - recognition.lastRestartAt < COOLDOWN) {
        return;
      }

      recognition.restarting = true;
      setTimeout(() => {
        try {
          recognition.start();
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error("Restart error:", e);
          }
        }
        recognition.lastRestartAt = Date.now();
        recognition.restarting = false;
      }, 250);
    };

    // ========== ONERROR ==========
  recognition.onerror = (event) => {
  // ✅ FIX: Set false on error, not true!
  isRecognizingRef.current = false;
  setListening(false);

  console.log("🔴 Error:", event.error);

  // Fatal errors
  if (event.error === "not-allowed" || event.error === "service-not-allowed") {
    recognition.shouldAutoRestart = false;
    console.error("❌ Mic permission denied!");
    alert("Please allow microphone access in browser settings");
    return;
  }

  // ✅ FIX: Silent ignore no-speech
  if (event.error === "no-speech" || event.error === "audio-capture") {
    return; // onend will handle restart
  }

  // Other recoverable errors (network, aborted, etc.)
  console.warn("⚠️ Recoverable error, attempting restart...");
  
  if (recognition.shouldAutoRestart) {
    const now = Date.now();
    const COOLDOWN_MS = 1000;

    if (!recognition.restarting && now - recognition.lastRestartAt >= COOLDOWN_MS) {
      recognition.restarting = true;
      setTimeout(() => {
        try {
          recognition.start();
          console.log("🔄 Restarted after error");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error("Restart failed:", e);
          }
        }
        recognition.lastRestartAt = Date.now();
        recognition.restarting = false;
      }, 300);
    }
  }
};

    // ========== ONRESULT ==========
    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();

      console.log("🎤 HEARD:", transcript);

      if (!userData?.assistantName) {
        console.warn("⚠️ Assistant name not loaded yet");
        return;
      }

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        console.log("✅ Assistant name detected!");
        setAiText("");
        setUserText(transcript);

        // Stop recognition
        recognition.shouldAutoRestart = false;
        try {
          recognition.stop();
        } catch (e) {}

        isRecognizingRef.current = false;
        setListening(false);

        // Get response
        const data = await getGeminiResponse(transcript);

        if (data) {
          console.log("🤖 Response:", data.response);
          handleCommand(data);
          setAiText(data.response);
        } else {
          console.error("❌ No response from backend");
          // ✅ FIX: Restart even if no response
          recognition.shouldAutoRestart = true;
          setTimeout(() => startRecognition(), 1000);
        }

        setUserText("");
      }
    };

    // ========== CLEANUP ==========
    return () => {
      try {
        recognition.shouldAutoRestart = false;
        recognition.stop();
      } catch (e) {}
      clearTimeout(initialTimer);
      setListening(false);
    };
  }, [userData?.assistantName, getGeminiResponse]);

  // ========== JSX (same as before) ==========
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 relative"
      style={{ backgroundImage: `url(${authImg})` }}
    >
      <div className="absolute top-4 right-4 sm:top-6 md:top-8 lg:top-10 sm:right-6 md:right-8 lg:right-10 z-10">
        <div className="relative inline-flex items-center justify-center group">
          <div className="absolute inset-0 duration-500 opacity-70 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-md filter group-hover:opacity-100 group-hover:duration-200"></div>
          <a
            role="button"
            className="group relative inline-flex items-center justify-center text-sm sm:text-base rounded-xl bg-gray-900/90 px-4 sm:px-6 py-2.5 font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 hover:shadow-gray-600/30"
            onClick={() => navigate("/customize")}
          >
            Customize Your Assistant
            <svg
              aria-hidden="true"
              viewBox="0 0 10 10"
              height="10"
              width="10"
              fill="none"
              className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M0 5h7"
                className="transition opacity-0 group-hover:opacity-100"
              ></path>
              <path
                d="M1 1l4 4-4 4"
                className="transition group-hover:translate-x-[3px]"
              ></path>
            </svg>
          </a>
        </div>
      </div>

      <div className="w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] flex justify-center items-center overflow-hidden shadow-lg rounded-2xl transition-transform duration-300 hover:scale-105 mt-16 sm:mt-20 md:mt-8">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="h-full w-full object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
        />
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 sm:mb-8 mt-6 text-center tracking-wide">
        I'm Your{" "}
        <span className="text-[#15a7d3] font-[techy] animate-pulse">
          {userData?.assistantName}
        </span>
      </h1>

      <div className="w-[150px] sm:w-[180px] md:w-[200px] transition-all duration-300 hover:scale-105">
        {!aiText && <img src={userImg} alt="User" className="w-full" />}
        {aiText && <img src={aiImg} alt="AI" className="w-full" />}
      </div>

      <h1 className="bg-gradient-to-r from-cyan-500 to-lime-800 bg-clip-text text-transparent text-base sm:text-lg md:text-xl font-semibold text-wrap max-w-[80%] text-center my-4">
        {userText ? userText : aiText ? aiText : null}
      </h1>

      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-10">
        <button
          type="submit"
          className="relative p-[3px] cursor-pointer group"
          onClick={handleLogout}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative px-5 sm:px-6 md:px-8 py-2.5 bg-black rounded-full transition-all duration-300 text-white hover:bg-transparent text-center text-sm sm:text-base font-medium group-hover:-translate-y-1 group-hover:shadow-lg">
            Log Out
          </div>
        </button>
      </div>
    </div>
  );
};

export default Home;
