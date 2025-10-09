import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user ID missing" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user); // Send the user object!
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "update user error", error: error.message });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command);
    user.save();
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(200).json({ type: "general", userInput: command, response: "Sorry, I Can't Understand" });
    }
    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("HH:mm:ss")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("MMMM")}`,
        });

      case "google_search":
      case "youtube_search":
      case "wikipedia_search":
      case "facebook_open":
      case "instagram_open":
      case "news_search":
      case "weather":
      case "joke":
      case "quote":
      case "advice":
      case "time":
      case "date":
      case "math":
      case "translation":
      case "definition":
      case "synonym":
      case "antonym":
      case "spell_check":
      case "grammar_check":
      case "currency_conversion":
      case "unit_conversion":
      case "reminder":
      case "alarm":
      case "timer":
      case "calendar_event":
      case "youtube_open":
      case "email_management":
      case "task_management":
      case "note_taking":
      case "general":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res.json({ response: "Sorry, I Can't Understand" });
    }
  } catch (error) {
    console.error(error);
    return res.status(200).json({ type: "general", userInput: "", response: "Sorry, something went wrong" });
  }
};
