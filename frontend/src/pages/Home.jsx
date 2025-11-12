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
  
  // Refs for tracking state across renders
  const isSpeakingRef = useRef(false);        // AI bol raha hai ya nahi
  const isRecognizingRef = useRef(false);     // Recognition active hai ya nahi
  const recognitionRef = useRef(null);        // SpeechRecognition instance
  
  const synth = window.speechSynthesis;

  // ========== LOGOUT HANDLER ==========
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

  // ========== SAFE START RECOGNITION ==========
  // Recognition sirf tabhi start hoga jab AI nahi bol raha aur already recognizing nahi hai
  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        // InvalidStateError ignore karo (already started ka error)
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  // ========== TEXT TO SPEECH ==========
  const speak = (text) => {
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "hi-IN";
    
    // Hindi voice select karo agar available hai
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    // Jab AI bol raha hai tab recognition pause kar do (loop se bachne ke liye)
    if (recognitionRef.current) {
      recognitionRef.current.shouldAutoRestart = false;
    }

    isSpeakingRef.current = true;

    // Jab speech khatam ho jaye
    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;

      // Speech khatam hone ke baad recognition dobara start karo
      const rec = recognitionRef.current;
      if (rec) {
        rec.shouldAutoRestart = true;  // Auto-restart enable karo
        setTimeout(() => {
          startRecognition();  // 800ms delay se race condition avoid hoti hai
        }, 800);
      }
    };

    synth.cancel(); // Pehle se koi speech chal rahi ho toh band karo
    synth.speak(utterence);
  };

  // ========== COMMAND HANDLER ==========
  const handleCommand = (data) => {
    if (!data) return;
    const { type, userInput, response } = data;
    
    // Pehle response speak karo
    speak(response);

    // Command type ke according action lo
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
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    
    // Recognition settings
    recognition.continuous = true;         // Multiple results lene ke liye (but session end ho sakta hai)
    recognition.lang = "en-US";           // English language
    recognition.interimResults = false;   // Sirf final results chahiye

    // Custom properties for restart control (instance pe hi rakhte hain for simplicity)
    recognition.shouldAutoRestart = true;  // Auto-restart enabled hai ya nahi
    recognition.restarting = false;        // Currently restart ho raha hai ya nahi
    recognition.lastRestartAt = 0;         // Last restart ka timestamp (cooldown ke liye)

    recognitionRef.current = recognition;

    // ========== INITIAL START (Component mount pe) ==========
    const initialStartTimer = setTimeout(() => {
      startRecognition();
    }, 800);

    // ========== EVENT: ONSTART ==========
    // Jab recognition successfully start ho jaye
    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      console.log("✅ Recognition started");
    };

    // ========== EVENT: ONEND ==========
    // Jab recognition service disconnect ho jaye (continuous mode me bhi hota hai)
    // Yeh SINGLE SOURCE OF TRUTH hai restart ke liye - sabse important fix!
    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      console.log("⚠️ Recognition ended");

      // Agar auto-restart disabled hai toh kuch mat karo (e.g. speaking time pe)
      if (!recognition.shouldAutoRestart) return;

      const now = Date.now();
      const COOLDOWN_MS = 1000; // 1 second cooldown between restarts

      // Agar already restart ho raha hai ya cooldown period me hai toh skip karo
      if (recognition.restarting || now - recognition.lastRestartAt < COOLDOWN_MS) {
        return;
      }

      // Safe restart with guard
      recognition.restarting = true;
      setTimeout(() => {
        try {
          recognition.start();
          console.log("🔄 Recognition restarted");
        } catch (e) {
          // InvalidStateError ignore karo (already started)
          if (e.name !== "InvalidStateError") {
            console.error("Restart error:", e);
          }
        }
        recognition.lastRestartAt = Date.now();
        recognition.restarting = false;
      }, 250); // Small delay to let the engine fully tear down
    };

    // ========== EVENT: ONERROR ==========
    // Jab koi error aaye recognition me
    recognition.onerror = (event) => {
      isRecognizingRef.current = false; // ✅ FIX: Error pe recognizing = false mark karo
      setListening(false);
      console.error("❌ Recognition error:", event.error);

      // Fatal errors: permission denied - auto-restart band kar do
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        recognition.shouldAutoRestart = false;
        console.error("Permission denied - auto-restart disabled");
        return;
      }

      // Recoverable errors: network, no-speech, audio-capture etc.
      // Guarded restart attempt karo
      if (recognition.shouldAutoRestart) {
        const now = Date.now();
        const COOLDOWN_MS = 1000;

        if (!recognition.restarting && now - recognition.lastRestartAt >= COOLDOWN_MS) {
          recognition.restarting = true;
          setTimeout(() => {
            try {
              recognition.start();
              console.log("🔄 Recognition restarted after error");
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.error("Error restart failed:", e);
              }
            }
            recognition.lastRestartAt = Date.now();
            recognition.restarting = false;
          }, 300);
        }
      }
    };

    // ========== EVENT: ONRESULT ==========
    // Jab speech-to-text result mile
    recognition.onresult = async (event) => {
      // Last result ka transcript nikalo
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      
      console.log("🎤 Heard:", transcript);

      // Check karo agar transcript me assistant name hai
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);

        // Recognition ko cleanly stop karo (onend fire hoga)
        recognition.shouldAutoRestart = false; // Stop auto-restart temporarily
        try {
          recognition.stop(); // Cleanly end the session
        } catch (e) {
          console.error("Stop error:", e);
        }

        isRecognizingRef.current = false;
        setListening(false);

        // Gemini se response lo
        const data = await getGeminiResponse(transcript);
        
        if (data) {
          handleCommand(data);  // Command execute karo (speak bhi hoga)
          setAiText(data.response);
        }
        
        setUserText("");
        // Note: speak() ke onend me recognition dobara start hoga automatically
      }
    };

    // ========== CLEANUP ==========
    return () => {
      try {
        recognition.shouldAutoRestart = false; // Auto-restart disable karo
        recognition.stop();                    // Recognition band karo
      } catch (e) {
        console.error("Cleanup error:", e);
      }
      clearTimeout(initialStartTimer);
      setListening(false);
    };
  }, [userData.assistantName, getGeminiResponse]);

  // ========== JSX RENDER ==========
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 relative"
      style={{ backgroundImage: `url(${authImg})` }}
    >
      {/* Customize Button - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 md:top-8 lg:top-10 sm:right-6 md:right-8 lg:right-10 z-10">
        <div className="relative inline-flex items-center justify-center group">
          <div className="absolute inset-0 duration-500 opacity-70 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-md filter group-hover:opacity-100 group-hover:duration-200"></div>
          <a
            role="button"
            className="group relative inline-flex items-center justify-center text-sm sm:text-base rounded-xl bg-gray-900/90 px-4 sm:px-6 py-2.5 font-medium text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 hover:shadow-gray-600/30"
            title="customize"
            onClick={() => {
              navigate("/customize");
            }}
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

      {/* Assistant Image */}
      <div className="w-[200px] sm:w-[250px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] flex justify-center items-center overflow-hidden shadow-lg rounded-2xl transition-transform duration-300 hover:scale-105 mt-16 sm:mt-20 md:mt-8">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="h-full w-full object-cover rounded-2xl transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Assistant Name */}
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 sm:mb-8 mt-6 text-center tracking-wide">
        I'm Your{" "}
        <span className="text-[#15a7d3] font-[techy] animate-pulse">
          {userData?.assistantName}
        </span>{" "}
      </h1>

      {/* User/AI Animation */}
      <div className="w-[150px] sm:w-[180px] md:w-[200px] transition-all duration-300 hover:scale-105">
        {!aiText && <img src={userImg} alt="User" className="w-full" />}
        {aiText && <img src={aiImg} alt="AI" className="w-full" />}
      </div>

      {/* Text Display (User input ya AI response) */}
      <h1 className="bg-gradient-to-r from-cyan-500 to-lime-800 bg-clip-text text-transparent text-base sm:text-lg md:text-xl font-semibold text-wrap max-w-[80%] text-center my-4">
        {userText ? userText : aiText ? aiText : null}
      </h1>

      {/* Logout Button - Bottom Right */}
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
