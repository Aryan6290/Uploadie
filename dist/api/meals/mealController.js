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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllMeals = exports.getMealsForDay = exports.getAllMealsforDay = exports.addMeal = void 0;
const bson_1 = require("bson");
const database_1 = require("./../../database");
const addMeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDatabase)();
    try {
        const { userId, type, time, date, } = req.body;
        if (!type || !time || !date) {
            return res.status(400).send({ message: "Sufficient data not provided" });
        }
        if (type !== "nonveg" && type !== "veg") {
            return res.status(401).send({ message: "Wrong MealType Sent" });
        }
        if (time !== "day" && time !== "night") {
            return res.status(401).send({ message: "Wrong Meal Time sent" });
        }
        const isUser = yield db.collection("users").findOne({
            _id: new bson_1.ObjectId(userId),
        });
        if (!isUser) {
            return res.status(404).send({ message: "No User Found" });
        }
        const checkMealAlreadyPresent = yield db.collection("meals").findOne({
            userId: new bson_1.ObjectId(userId),
            date: date,
            time: time,
        });
        if (checkMealAlreadyPresent) {
            return res
                .status(401)
                .send({ message: "Meal Already Present for the date and time" });
        }
        const updatedMeals = yield db.collection("schedule").findOne({});
        var dayNames = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        const ans = dayNames[date.getDay() - 1];
        const addNewMeal = yield db.collection("meals").insertOne({
            userId: new bson_1.ObjectId(userId),
            date: date,
            type: type,
            time: time,
            userDetails: isUser,
        });
        if (addNewMeal) {
            return res.status(200).send({ message: "Meal added successfully" });
        }
        return res.status(500).send({ message: "Failed to add meal" });
    }
    catch (error) {
        console.log("Error during add meal", error);
        return res.status(500).send({ message: "Backend lmao ded" });
    }
});
exports.addMeal = addMeal;
const getAllMealsforDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDatabase)();
    try {
        const { time, date } = req.body;
        if (!time || !date) {
            return res.status(400).send({ message: "Sufficient data not provided" });
        }
        const getMeals = yield db
            .collection("meals")
            .find({ date: date, time: time })
            .toArray();
        if (getMeals.length >= 0) {
            return res.status(200).send({ message: "Meals found", meals: getMeals });
        }
        return res
            .status(500)
            .send({ message: "Something went wrong! Backend werror" });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .send({ message: "Something went wrong! Backend werror" });
    }
});
exports.getAllMealsforDay = getAllMealsforDay;
const getMealsForDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDatabase)();
    try {
        const { userId, date } = req.body;
        if (!userId || !date) {
            return res.status(400).send({ message: "Sufficient data not provided" });
        }
        const isUser = yield db.collection("users").findOne({
            _id: new bson_1.ObjectId(userId),
        });
        if (!isUser) {
            return res.status(404).send({ message: "No User Found" });
        }
        const getMeals = yield db
            .collection("meals")
            .find({ date: date, userId: new bson_1.ObjectId(userId) })
            .toArray();
        if (getMeals.length >= 0) {
            return res.status(200).send({ message: "Meals found", meals: getMeals });
        }
        return res
            .status(500)
            .send({ message: "Something went wrong! Backend werror" });
    }
    catch (error) {
        console.log(error);
        return res
            .status(500)
            .send({ message: "Something went wrong! Backend werror" });
    }
});
exports.getMealsForDay = getMealsForDay;
const deleteAllMeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDatabase)();
    try {
        const deleteAll = yield db.collection("meals").deleteMany({});
        if (deleteAll) {
            return res.status(200).send({ message: "deleted" });
        }
        return res
            .status(500)
            .send({ message: "Something went wrong! Backend werror" });
    }
    catch (e) {
        return res
            .status(500)
            .send({ message: "Something went wrong! Backend werror" });
    }
});
exports.deleteAllMeals = deleteAllMeals;
//# sourceMappingURL=mealController.js.map