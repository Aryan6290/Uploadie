"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../../.env") });
if (process.env.ENV_NAME === undefined) {
    dotenv_1.default.config();
}
exports.Data = {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
    PORT: process.env.PORT,
    JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
};
//# sourceMappingURL=config.js.map