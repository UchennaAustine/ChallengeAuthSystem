import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { statusCode } from "../utils/statusCode";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  firstMailWithOtp,
  resetPasswordMail,
  secondMailForVerification,
} from "../utils/email";

const prisma = new PrismaClient();

export const Register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    const lock = await bcrypt.genSalt(5);
    const encrypt = await bcrypt.hash(password, lock);

    const tokenValue = crypto.randomBytes(2).toString("hex");
    const otp = crypto.randomBytes(2).toString("hex");

    // not too important
    const token = jwt.sign(tokenValue, "token");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: encrypt,
        token,
        otp,
      },
    });

    firstMailWithOtp(user).then(() => {
      console.log("A mail has being sent");
    });
    return res.status(statusCode.CREATED).json({
      message: `Registration`,
      data: user,
    });
  } catch (error: any) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: `Registration error:${error.message}`,
      info: error,
    });
  }
};

export const FirstVerificationWithOtp = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { otp } = req.body;

    jwt.verify(token, "password", async (err, payload: any) => {
      if (err) {
        throw new Error();
      } else {
        const userAccount = await prisma.user.findUnique({
          where: { id: payload?.id! },
        });

        if (userAccount?.otp === otp) {
          secondMailForVerification(userAccount).then(() => {
            console.log("Mail Sent...");
          });

          return res.status(statusCode.OK).json({
            message: "PLease to verify your Account",
          });
        } else {
          return res.status(statusCode.BAD_REQUEST).json({
            message: "Error with your Token",
          });
        }
      }
    });
  } catch (error: any) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: `First Verification Error: ${error.message}
      `,
      info: error,
    });
  }
};

export const SecondVerification = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    jwt.verify(token, "password", async (err, payload: any) => {
      if (err) {
        throw new Error();
      } else {
        const auth = await prisma.user.findUnique({
          where: { id: payload?.id },
        });

        if (auth) {
          await prisma.user.update({
            where: { id: auth?.id },
            data: { token: "", verified: true },
          });

          return res.status(statusCode.OK).json({
            message: "Congratulations...!!! You have been verified",
          });
        } else {
          return res.status(statusCode.BAD_REQUEST).json({
            message: `Token might not be correct`,
          });
        }
      }
    });
  } catch (error) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: `Second Verification Error: ${error.message}
      `,
      info: error,
    });
  }
};

export const SignIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const checkPassword = await bcrypt.compare(password, user?.password);
      if (checkPassword) {
        if (user.verified && user.token === "") {
          const token = jwt.sign(
            { id: user?.id, email: user?.email },
            "password"
          );
          return res.status(statusCode.OK).json({
            message: `Welcome ${user.email}`,
            data: token,
          });
        } else {
          return res.status(statusCode.FORBIDDEN).json({
            message: `User is not verified`,
          });
        }
      } else {
        return res.status(statusCode.BAD_REQUEST).json({
          message: `Invalid Password Provided`,
        });
      }
    } else {
      return res.status(statusCode.NOT_FOUND).json({
        message: `User Not found`,
      });
    }
  } catch (error: any) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: "error signing in auth",
      data: error.message,
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.verified && user?.token === "") {
      const token = jwt.sign({ id: user?.id }, "password");

      const passwordReset = await prisma.user.update({
        where: { id: user?.id },
        data: { token },
      });

      resetPasswordMail(passwordReset).then(() => {
        console.log("A Mail has being sent....");
      });

      return res.status(statusCode.CREATED).json({
        message: "success",
        data: passwordReset,
      });
    } else {
      return res.status(statusCode.FORBIDDEN).json({
        message: "Unauthorised Action",
      });
    }
  } catch (error) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: `Reset Password Error: ${error.message}
      `,
      info: error,
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const userID: any = jwt.verify(
      token,
      "password",
      (err: any, payload: any) => {
        if (err) {
          return new Error();
        } else {
          return payload;
        }
      }
    );

    const user = await prisma.user.findUnique({
      where: { id: userID?.id },
    });

    if (user?.verified && user?.token !== "") {
      const locker = await bcrypt.genSalt(10);
      const encryption = await bcrypt.hash(password, locker);

      const userUpdate = await prisma.user.update({
        where: { id: user?.id },
        data: { password: encryption, token: "" },
      });

      return res.status(statusCode.CREATED).json({
        message: `${user?.name}: your password have being changed`,
        data: userUpdate,
      });
    } else {
      return res.status(statusCode.BAD_REQUEST).json({
        message: `Please Verify your account`,
      });
    }
  } catch (error: any) {
    return res.status(statusCode.BAD_REQUEST).json({
      message: `Change Password Error: ${error.message}
      `,
      info: error,
    });
  }
};
