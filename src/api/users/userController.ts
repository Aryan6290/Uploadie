import { ObjectId } from "bson";
import { Data } from "./../../config";

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../schemas/user";
import jwt from "jsonwebtoken";
import { UserType } from "../../data/data";
import { getDatabase } from "./../../database";

export const loginUser = async (req: Request, res: Response) => {
  const db = getDatabase();
  try {
    const { userName, password }: { userName: string; password: string } =
      req.body;
    if (!userName || !password) {
      return res.status(400).send({ message: "Sufficient data not provided" });
    }

    const isUser = await db.collection<User>("users").findOne({
      userName: userName,
    });

    if (!isUser) {
      return res.status(404).send({ message: "No User Found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, isUser.password);
    if (isPasswordCorrect) {
      const tokenData: any = {};
      tokenData._id = isUser._id;
      tokenData.userName = isUser.userName;
      const token = jwt.sign(tokenData, Data.JWT_SECRET_TOKEN);
      delete isUser["password"];
      return res.status(200).send({
        message: " User Found",
        token: token,
        data: isUser,
      });
    }

    return res.status(404).send({ message: "User noddt found" });
  } catch (error) {
    console.log("error in login", error);
    return res.status(500).send({ message: "Server error" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  const db = getDatabase();
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send({ message: "Sufficient data not provided" });
    }
    const getUser = await db
      .collection<User>("users")
      .findOne({ _id: new ObjectId(userId) });
    if (!getUser) {
      return res.status(404).send({ message: "User not found" });
    }
    delete getUser["password"];
    return res.status(200).send({ message: "User found", data: getUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server error!" });
  }
};

export const signupNewUser = async (req: Request, res: Response) => {
  const db = getDatabase();
  try {
    const { password, userName } = req.body;
    if (!userName || !password) {
      return res.status(400).send({ message: "Sufficient data not provided" });
    }

    const isUserAlreadyPresent = await db
      .collection<User>("users")
      .findOne({ userName });
    if (isUserAlreadyPresent) {
      return res
        .status(400)
        .send({ message: "User with this rollNo already present!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await db.collection<User>("users").insertOne({
      password: hashedPassword,
      userName,
    });
    const tokenData: any = {};
    tokenData._id = newUser.insertedId;
    tokenData.userName = userName;

    const token = jwt.sign(tokenData, Data.JWT_SECRET_TOKEN);
    if (newUser) {
      return res
        .status(200)
        .send({ message: "User added successfuly", token: token });
    }
    return res.status(500).send({ message: "Failed to add user" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server error!" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const db = getDatabase();
  try {
    const {
      rollNo,
      oldPassword,
      newPassword,
    }: { rollNo: string; oldPassword: string; newPassword: string } = req.body;
    if (!rollNo || !oldPassword || !newPassword) {
      return res.status(400).send({ message: "Sufficient data not provided" });
    }

    const isUser = await db.collection<User>("users").findOne({
      rollNo: rollNo,
    });

    if (!isUser) {
      return res.status(404).send({ message: "No User Found" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      isUser.password
    );
    if (isPasswordCorrect) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const updatedPassword = await db
        .collection<User>("users")
        .updateOne({ rollNo: rollNo }, { $set: { password: hashedPassword } });

      if (updatedPassword) {
        return res.status(200).send({ message: "Password updated" });
      }
      return res.status(500).send({ message: "Failed to change password!" });
    }
    return res.status(500).send({ message: "Failed to change password!" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ message: "Failed to change password, backend error " });
  }
};
