import express from "express";
import {
  askToAssistant,
  getCurrentUser,
  updateAssistant,
} from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post(
  "/update",
  isAuth,
  (req, res, next) => {
    upload.single("assistantImage")(req, res, (err) => {
      if (err && err.code !== "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  updateAssistant
);

userRouter.post("/asktoassistant", isAuth, askToAssistant);

export default userRouter;
