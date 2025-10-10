import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import genToken from "../config/token.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email Already Exist !" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be atleast 6 Character !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashedPassword,
      email,
    });

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "none",
      secure: true,
    });

    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ message: `Sign Up error ${error}` });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email Is Not Exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    // Remove unnecessary password hashing - we only need to verify the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    const token = genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });

    // Don't send full user object with password
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ message: `Login error ${error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout Successfully 👋" });
  } catch (error) {
    return res.status(500).json({ message: `Logout Error ${error}` });
  }
};
