"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller/controller");
const inputVerificationHandler_1 = __importDefault(require("../configs/inputVerificationHandler"));
const inputVerification_1 = require("../configs/inputVerification");
const router = express_1.default.Router();
router
    .route("/register")
    .post((0, inputVerificationHandler_1.default)(inputVerification_1.registerValidator), controller_1.Register);
router.route("/:token/verify-otp").post(controller_1.FirstVerificationWithOtp);
router.route("/:token/verification").get(controller_1.SecondVerification);
router
    .route("/reset-password")
    .get((0, inputVerificationHandler_1.default)(inputVerification_1.resetPasswordValidator), controller_1.resetPassword);
router
    .route("/:token/change-password")
    .get((0, inputVerificationHandler_1.default)(inputVerification_1.changedPasswordValidator), controller_1.changePassword);
router
    .route("/sign-in")
    .post((0, inputVerificationHandler_1.default)(inputVerification_1.signInValidator), controller_1.SignIn);
exports.default = router;
