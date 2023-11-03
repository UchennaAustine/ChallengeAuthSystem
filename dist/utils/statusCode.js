"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCode = void 0;
var statusCode;
(function (statusCode) {
    statusCode[statusCode["OK"] = 200] = "OK";
    statusCode[statusCode["CREATED"] = 201] = "CREATED";
    statusCode[statusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    statusCode[statusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    statusCode[statusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
})(statusCode || (exports.statusCode = statusCode = {}));
