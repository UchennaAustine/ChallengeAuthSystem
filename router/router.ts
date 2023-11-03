import express from "express";
import {
  FirstVerificationWithOtp,
  Register,
  SecondVerification,
  SignIn,
  changePassword,
  resetPassword,
} from "../controller/controller";
import inputVerificationHandler from "../configs/inputVerificationHandler";
import {
  changedPasswordValidator,
  registerValidator,
  resetPasswordValidator,
  signInValidator,
} from "../configs/inputVerification";

const router = express.Router();

router
  .route("/register")
  .post(inputVerificationHandler(registerValidator), Register);
router.route("/:token/verify-otp").post(FirstVerificationWithOtp);
router.route("/:token/verification").get(SecondVerification);
router
  .route("/reset-password")
  .get(inputVerificationHandler(resetPasswordValidator), resetPassword);
router
  .route("/:token/change-password")
  .get(inputVerificationHandler(changedPasswordValidator), changePassword);
router
  .route("/sign-in")
  .post(inputVerificationHandler(signInValidator), SignIn);

export default router;
