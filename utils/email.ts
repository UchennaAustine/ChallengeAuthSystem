import nodemailer from "nodemailer";
import { google } from "googleapis";
import ejs from "ejs";
import path from "path";
import jwt from "jsonwebtoken";

const googleID: string =
  "848542784186-9os7noa7qvcg3nckfu38s3bhob8u6oga.apps.googleusercontent.com";
const googleSecret: string = "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";
const googleUrl: string = "https://developers.google.com/oauthplayground";
const googleRefresh =
  "1//04GgN8ydoI_ZdCgYIARAAGAQSNwF-L9IrKCOkFE95PncupZNTb3WCiygNcFb1vp20oW-1SMJTKzSWxnWw2B6nf4S85GXSTpgR44M";

const oAuth = new google.auth.OAuth2(googleID, googleSecret, googleUrl);

oAuth.setCredentials({ access_token: googleRefresh });

export const firstMailWithOtp = async (userAccount: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;

    const transport = nodemailer.createTransport({
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

    const tokenId = jwt.sign({ id: userAccount?.id }, "password");

    const userInformation = {
      name: userAccount?.name,
      url: `http://localhost:4983/${tokenId}/verify-otp`,
      otp: userAccount?.otp,
    };

    const data = path.join(__dirname, "../view/firstOtp.ejs");

    const accurateData = await ejs.renderFile(data, userInformation);

    const otpMail = {
      from: "codelabbest@gmail.com",
      to: userAccount?.email,
      subject: "Verification OTP",
      html: accurateData,
    };

    transport.sendMail(otpMail);
  } catch (error: any) {
    console.log(error);
  }
};

export const secondMailForVerification = async (userAccount: any) => {
  try {
    const accessToken: any = (await oAuth.getAccessToken()).token;
    const transporter = nodemailer.createTransport({
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

    const tokenId = jwt.sign({ id: userAccount?.id }, "password");

    const authData = {
      email: userAccount?.email,
      url: `http://localhost:4983/${tokenId}/verification`,
    };

    const locateFile = path.join(__dirname, "../view/verify.ejs");
    const readFile = await ejs.renderFile(locateFile, authData);

    const mailer = {
      from: "codelabbest@gmail.com",
      to: userAccount?.email,
      subject: `Verification Grant`,
      html: readFile,
    };

    transporter.sendMail(mailer);
  } catch (error: any) {
    console.log(error);
  }
};
