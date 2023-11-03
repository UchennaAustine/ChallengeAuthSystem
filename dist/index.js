"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const application_1 = require("./application");
const envs_1 = require("./utils/envs");
process.on("uncaughtException", (error) => {
    console.log(`Error due to uncaughtException: ${error}`);
    process.exit(1);
});
const Port = envs_1.envs.Port;
const application = (0, express_1.default)();
(0, application_1.myApplication)(application);
const myServer = application.listen(Port, () => {
    console.log(" ");
    console.log(`Active:`, Port);
});
process.on("uncaughtException", (error) => {
    console.log(`Error due to uncaughtException: ${error}`);
    myServer.close(() => {
        process.exit(1);
    });
});
