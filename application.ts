import cors from "cors";
import user from "./router/router";
import express, { Application, Response, Request } from "express";
import { statusCode } from "./utils/statusCode";

export const myApplication = (app: Application) => {
  try {
    app.use(express.json());
    app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
      })
    );
    app.use("/api", user);
    app.get("/", (req: Request, res: Response) => {
      return res.status(statusCode.OK).json({
        message: "Welcome",
      });
    });
  } catch (error: any) {
    console.log(`Application error:${error}`);
  }
};
