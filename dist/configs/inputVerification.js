"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changedPasswordValidator = exports.resetPasswordValidator = exports.signInValidator = exports.registerValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerValidator = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required(),
    password: joi_1.default.string().required().min(8),
    name: joi_1.default.string().required(),
    confirm: joi_1.default.ref("password"),
});
exports.signInValidator = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required(),
    password: joi_1.default.string().required().min(8),
});
exports.resetPasswordValidator = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required(),
});
exports.changedPasswordValidator = joi_1.default.object({
    password: joi_1.default.string().required().min(8),
    confirm: joi_1.default.ref("password"),
});
