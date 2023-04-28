"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./api/router");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
const PORT = config_1.Data.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Welcome to S3 Uploader!");
});
app.use("/api", (req, res, next) => {
    console.log(req.url);
    next();
}, router_1.router);
app.listen(() => { });
app.listen(PORT, () => {
    return console.log(`App is listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map