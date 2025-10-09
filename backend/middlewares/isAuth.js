import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    // jwt.verify throws on invalid/malformed token; don't await it
    let verifyToken;
    try {
      verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("JWT verify error:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    console.log("isAuth unexpected error:", error);
    return res.status(500).json({ message: "is Auth error" });
  }
};

export default isAuth;
