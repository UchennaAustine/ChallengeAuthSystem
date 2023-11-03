"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.SignIn = exports.SecondVerification = exports.FirstVerificationWithOtp = exports.Register = void 0;
const client_1 = require("@prisma/client");
const statusCode_1 = require("../utils/statusCode");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const prisma = new client_1.PrismaClient();
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const lock = yield bcrypt_1.default.genSalt(5);
        const encrypt = yield bcrypt_1.default.hash(password, lock);
        const tokenValue = crypto_1.default.randomBytes(2).toString("hex");
        const otp = crypto_1.default.randomBytes(2).toString("hex");
        // not too important
        const token = jsonwebtoken_1.default.sign(tokenValue, "token");
        const user = yield prisma.user.create({
            data: {
                name,
                email,
                password: encrypt,
                token,
                otp,
            },
        });
        (0, email_1.firstMailWithOtp)(user).then(() => {
            console.log("A mail has being sent");
        });
        return res.status(statusCode_1.statusCode.CREATED).json({
            message: `Registration`,
            data: user,
        });
    }
    catch (error) {
        return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
            message: `Registration error:${error.message}`,
            info: error,
        });
    }
});
exports.Register = Register;
const FirstVerificationWithOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { otp } = req.body;
        jsonwebtoken_1.default.verify(token, "password", (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error();
            }
            else {
                const userAccount = yield prisma.user.findUnique({
                    where: { id: payload === null || payload === void 0 ? void 0 : payload.id },
                });
                if ((userAccount === null || userAccount === void 0 ? void 0 : userAccount.otp) === otp) {
                    (0, email_1.secondMailForVerification)(userAccount).then(() => {
                        console.log("Mail Sent...");
                    });
                    return res.status(statusCode_1.statusCode.OK).json({
                        message: "PLease to verify your Account",
                    });
                }
                else {
                    return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                        message: "Error with your Token",
                    });
                }
            }
        }));
    }
    catch (error) {
        return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
            message: `First Verification Error: ${error.message}
      `,
            info: error,
        });
    }
});
exports.FirstVerificationWithOtp = FirstVerificationWithOtp;
const SecondVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        jsonwebtoken_1.default.verify(token, "password", (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error();
            }
            else {
                const auth = yield prisma.user.findUnique({
                    where: { id: payload === null || payload === void 0 ? void 0 : payload.id },
                });
                if (auth) {
                    yield prisma.user.update({
                        where: { id: auth === null || auth === void 0 ? void 0 : auth.id },
                        data: { token: "", verified: true },
                    });
                    return res.status(statusCode_1.statusCode.OK).json({
                        message: "Congratulations...!!! You have been verified",
                    });
                }
                else {
                    return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                        message: `Token might not be correct`,
                    });
                }
            }
        }));
    }
    catch (error) {
        return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
            message: `Second Verification Error: ${error.message}
      `,
            info: error,
        });
    }
});
exports.SecondVerification = SecondVerification;
const SignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (user) {
            const checkPassword = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
            if (checkPassword) {
                if (user.verified && user.token === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id, email: user === null || user === void 0 ? void 0 : user.email }, "password");
                    return res.status(statusCode_1.statusCode.OK).json({
                        message: `Welcome ${user.email}`,
                        data: token,
                    });
                }
                else {
                    return res.status(statusCode_1.statusCode.FORBIDDEN).json({
                        message: `User is not verified`,
                    });
                }
            }
            else {
                return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                    message: `Invalid Password Provided`,
                });
            }
        }
        else {
            return res.status(statusCode_1.statusCode.NOT_FOUND).json({
                message: `User Not found`,
            });
        }
    }
    catch (error) {
        return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
            message: "error signing in auth",
            data: error.message,
        });
    }
});
exports.SignIn = SignIn;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.token) === "") {
            const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id }, "password");
            const passwordReset = yield prisma.user.update({
                where: { id: user === null || user === void 0 ? void 0 : user.id },
                data: { token },
            });
            (0, email_1.resetPasswordMail)(passwordReset).then(() => {
                console.log("A Mail has being sent....");
            });
            return res.status(statusCode_1.statusCode.CREATED).json({
                message: "success",
                data: passwordReset,
            });
        }
        else {
            return res.status(statusCode_1.statusCode.FORBIDDEN).json({
                message: "Unauthorised Action",
            });
        }
    }
    catch (error) {
        return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
            message: `Reset Password Error: ${error.message}
      `,
            info: error,
        });
    }
});
exports.resetPassword = resetPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const userID = jsonwebtoken_1.default.verify(token, "password", (err, payload) => {
            if (err) {
                return new Error();
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.user.findUnique({
            where: { id: userID === null || userID === void 0 ? void 0 : userID.id },
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && (user === null || user === void 0 ? void 0 : user.token) !== "") {
            const locker = yield bcrypt_1.default.genSalt(10);
            const encryption = yield bcrypt_1.default.hash(password, locker);
            const userUpdate = yield prisma.user.update({
                where: { id: user === null || user === void 0 ? void 0 : user.id },
                data: { password: encryption, token: "" },
            });
            return res.status(statusCode_1.statusCode.CREATED).json({
                message: `${user === null || user === void 0 ? void 0 : user.name}: your password have being changed`,
                data: userUpdate,
            });
        }
        else {
            return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                message: `Please Verify your account`,
            });
        }
    }
    catch (error) {
        return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
            message: `Change Password Error: ${error.message}
      `,
            info: error,
        });
    }
});
exports.changePassword = changePassword;
