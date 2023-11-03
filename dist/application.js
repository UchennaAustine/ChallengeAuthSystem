"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myApplication = void 0;
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router/router"));
const express_1 = __importDefault(require("express"));
const statusCode_1 = require("./utils/statusCode");
const myApplication = (app) => {
    try {
        app.use(express_1.default.json());
        app.use((0, cors_1.default)({
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE"],
        }));
        app.use("/api", router_1.default);
        app.get("/", (req, res) => {
            return res.status(statusCode_1.statusCode.OK).json({
                message: "Welcome",
            });
        });
    }
    catch (error) {
        console.log(`Application error:${error}`);
    }
};
exports.myApplication = myApplication;
