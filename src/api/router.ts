import { Router } from "express";
import { authMiddleware } from "./auth";
import * as userController from "./users/userController";
import * as uploadController from "./upload/uploadController";

export const router = Router();

//Login and Signup
router.post("/user/login", userController.loginUser);
router.post("/user/add", userController.signupNewUser);
router.post("/user/get-details", userController.getUserDetails, authMiddleware);
router.post("/user/change", userController.changePassword, authMiddleware);

router.post("/user/get-details", userController.getUserDetails, authMiddleware);
router.post("/file/add", uploadController.uploadFile, authMiddleware);
router.delete("/file/delete", uploadController.deleteFile, authMiddleware);
router.post("/file/all", uploadController.getAllImages, authMiddleware);
