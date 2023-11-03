import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { statusCode } from "../utils/statusCode";

export default (Schema: joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = Schema.validate(req.body);

    if (error === undefined || typeof error === "undefined") {
      next();
    } else {
      return res.status(statusCode.BAD_REQUEST).json({
        message: "error",
        data: error.message,
      });
    }
  };
};
