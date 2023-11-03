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
exports.resetPasswordMail = exports.secondMailForVerification = exports.firstMailWithOtp = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleID = "848542784186-9os7noa7qvcg3nckfu38s3bhob8u6oga.apps.googleusercontent.com";
const googleSecret = "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";
const googleUrl = "https://developers.google.com/oauthplayground";
const googleRefresh = "1//04GgN8ydoI_ZdCgYIARAAGAQSNwF-L9IrKCOkFE95PncupZNTb3WCiygNcFb1vp20oW-1SMJTKzSWxnWw2B6nf4S85GXSTpgR44M";
const oAuth = new googleapis_1.google.auth.OAuth2(googleID, googleSecret, googleUrl);
oAuth.setCredentials({ access_token: googleRefresh });
const firstMailWithOtp = (userAccount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transport = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "codelabbest@gmail.com",
                clientId: googleID,
                clientSecret: googleSecret,
                refreshToken: googleRefresh,
                accessToken,
            },
        });
        const tokenId = jsonwebtoken_1.default.sign({ id: userAccount === null || userAccount === void 0 ? void 0 : userAccount.id }, "password");
        const userInformation = {
            name: userAccount === null || userAccount === void 0 ? void 0 : userAccount.name,
            url: `http://localhost:4983/${tokenId}/verify-otp`,
            otp: userAccount === null || userAccount === void 0 ? void 0 : userAccount.otp,
        };
        const data = path_1.default.join(__dirname, "../view/firstOtp.ejs");
        const accurateData = yield ejs_1.default.renderFile(data, userInformation);
        const otpMail = {
            from: "codelabbest@gmail.com",
            to: userAccount === null || userAccount === void 0 ? void 0 : userAccount.email,
            subject: "Verification OTP",
            html: accurateData,
        };
        transport.sendMail(otpMail);
    }
    catch (error) {
        console.log(error);
    }
});
exports.firstMailWithOtp = firstMailWithOtp;
const secondMailForVerification = (userAccount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "codelabbest@gmail.com",
                clientId: googleID,
                clientSecret: googleSecret,
                refreshToken: googleRefresh,
                accessToken,
            },
        });
        const tokenId = jsonwebtoken_1.default.sign({ id: userAccount === null || userAccount === void 0 ? void 0 : userAccount.id }, "password");
        const authData = {
            email: userAccount === null || userAccount === void 0 ? void 0 : userAccount.email,
            url: `http://localhost:4983/${tokenId}/verification`,
        };
        const locateFile = path_1.default.join(__dirname, "../view/verify.ejs");
        const readFile = yield ejs_1.default.renderFile(locateFile, authData);
        const mailer = {
            from: "codelabbest@gmail.com",
            to: userAccount === null || userAccount === void 0 ? void 0 : userAccount.email,
            subject: `Verification Grant`,
            html: readFile,
        };
        transporter.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.secondMailForVerification = secondMailForVerification;
const resetPasswordMail = (userAccount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access = (yield oAuth.getAccessToken()).token;
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "codelabbest@gmail.com",
                clientId: googleID,
                clientSecret: googleSecret,
                refreshToken: googleRefresh,
                accessToken: access,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: userAccount === null || userAccount === void 0 ? void 0 : userAccount.id }, "password");
        const userData = {
            name: userAccount === null || userAccount === void 0 ? void 0 : userAccount.name,
            email: userAccount === null || userAccount === void 0 ? void 0 : userAccount.email,
            url: `http://localhost:4983/api/${token}/reset-password`,
        };
        const readFile = path_1.default.join(__dirname, "../view/resetPassword.ejs");
        const actualData = yield ejs_1.default.renderFile(readFile, userData);
        const mailer = {
            from: "<codelabbest@gmail.com>",
            to: userAccount === null || userAccount === void 0 ? void 0 : userAccount.email,
            subject: `Welcome${userAccount === null || userAccount === void 0 ? void 0 : userAccount.name}, Reset your Password`,
            html: actualData,
        };
        transporter.sendMail(mailer);
    }
    catch (error) {
        console.log(error);
    }
});
exports.resetPasswordMail = resetPasswordMail;
