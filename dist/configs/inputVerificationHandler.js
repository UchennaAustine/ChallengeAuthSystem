"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../utils/statusCode");
exports.default = (Schema) => {
    return (req, res, next) => {
        const { error } = Schema.validate(req.body);
        if (error === undefined || typeof error === "undefined") {
            next();
        }
        else {
            return res.status(statusCode_1.statusCode.BAD_REQUEST).json({
                message: "error",
                data: error.message,
            });
        }
    };
};
