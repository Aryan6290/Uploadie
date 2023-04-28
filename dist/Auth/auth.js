"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const authMiddleware = (req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization;
        // console.log(bearerHeader);
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const decoded = jsonwebtoken_1.default.verify(bearerToken, config_1.Data.JWT_SECRET_TOKEN);
            res.locals.user = decoded;
            next();
        }
        else {
            // console.log('hii');
            res.status(403).send({ message: 'forbidden' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(403).send({ message: 'forbidden' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map