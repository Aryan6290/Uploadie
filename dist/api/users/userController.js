"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.signupNewUser = exports.getUserDetails = exports.loginUser = void 0;
const bson_1 = require("bson");
const config_1 = require("./../../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("./../../database");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDatabase)();
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).send({ message: "Sufficient data not provided" });
        }
        const isUser = yield db.collection("users").findOne({
            userName: userName,
        });
        if (!isUser) {
            return res.status(404).send({ message: "No User Found" });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, isUser.password);
        if (isPasswordCorrect) {
            const tokenData = {};
            tokenData._id = isUser._id;
            tokenData.userName = isUser.userName;
            const token = jsonwebtoken_1.default.sign(tokenData, config_1.Data.JWT_SECRET_TOKEN);
            delete isUser["password"];
            return res.status(200).send({
                message: " User Found",
                token: token,
                data: isUser,
            });
        }
        return res.status(404).send({ message: "User noddt found" });
    }
    catch (error) {
        console.log("error in login", error);
        return res.status(500).send({ message: "Server error" });
    }
});
exports.loginUser = loginUser;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDatabase)();
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).send({ message: "Sufficient data not provided" });
        }
        const getUser = yield db
            .collection("users")
            .findOne({ _id: new bson_1.ObjectId(userId) });
        if (!getUser) {
            return res.status(404).send({ message: "User not found" });
        }
        delete getUser["password"];
        return res.status(200).send({ message: "User found", data: getUser });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error!" });
    }
});
exports.getUserDetails = getUserDetails;
const signupNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDatabase)();
    try {
        const { password, userName } = req.body;
        if (!userName || !password) {
            return res.status(400).send({ message: "Sufficient data not provided" });
        }
        const isUserAlreadyPresent = yield db
            .collection("users")
            .findOne({ userName });
        if (isUserAlreadyPresent) {
            return res
                .status(400)
                .send({ message: "User with this rollNo already present!" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield db.collection("users").insertOne({
            password: hashedPassword,
            userName,
        });
        const tokenData = {};
        tokenData._id = newUser.insertedId;
        tokenData.userName = userName;
        const token = jsonwebtoken_1.default.sign(tokenData, config_1.Data.JWT_SECRET_TOKEN);
        if (newUser) {
            return res
                .status(200)
                .send({ message: "User added successfuly", token: token });
        }
        return res.status(500).send({ message: "Failed to add user" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error!" });
    }
});
exports.signupNewUser = signupNewUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDatabase)();
    try {
        const { rollNo, oldPassword, newPassword, } = req.body;
        if (!rollNo || !oldPassword || !newPassword) {
            return res.status(400).send({ message: "Sufficient data not provided" });
        }
        const isUser = yield db.collection("users").findOne({
            rollNo: rollNo,
        });
        if (!isUser) {
            return res.status(404).send({ message: "No User Found" });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, isUser.password);
        if (isPasswordCorrect) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
            const updatedPassword = yield db
                .collection("users")
                .updateOne({ rollNo: rollNo }, { $set: { password: hashedPassword } });
            if (updatedPassword) {
                return res.status(200).send({ message: "Password updated" });
            }
            return res.status(500).send({ message: "Failed to change password!" });
        }
        return res.status(500).send({ message: "Failed to change password!" });
    }
    catch (e) {
        console.log(e);
        return res
            .status(500)
            .send({ message: "Failed to change password, backend error " });
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=userController.js.map