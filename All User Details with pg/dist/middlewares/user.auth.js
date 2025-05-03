"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuth = void 0;
const utils_1 = require("../utils");
const UserAuth = async (req, res, next) => {
    const user = await (0, utils_1.validateSignature)(req);
    if (!user) {
        return res.status(404).json({ "Message": "Not found" });
    }
    next();
};
exports.UserAuth = UserAuth;
