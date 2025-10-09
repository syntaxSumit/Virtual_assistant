import express from "express";
import { logIn, logOut, signUp } from "../controllers/auth.controller.js";

const authRouter = express.Router();

// use lowercase routes to match typical frontend requests
authRouter.post("/signup", signUp);
authRouter.post("/signin", logIn);
authRouter.get("/logout", logOut);

export default authRouter;
