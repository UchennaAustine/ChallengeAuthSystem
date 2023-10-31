import express from "express";
import {
  FirstVerificationWithOtp,
  Register,
  SecondVerification,
  SignIn,
} from "../controller/controller";

const router = express.Router();

router.route("/register").post(Register);
router.route("/:token/verify-otp").post(FirstVerificationWithOtp);
router.route("/:token/verification").get(SecondVerification);
router.route("/sign-in").post(SignIn);

export default router;
