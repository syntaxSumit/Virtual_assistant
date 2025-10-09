import jwt from "jsonwebtoken";

const genToken = (userId) => {
  try {
    // jwt.sign is synchronous when a callback isn't provided, so return the token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    return token;
  } catch (error) {
    console.log("genToken error:", error);
    return null;
  }
};

export default genToken;
