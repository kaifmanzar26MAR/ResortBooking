import { Router } from "express";
import { getAllUsers, getCurrentUser, getUserById, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/registeruser").post(registerUser);
router.route("/loginuser").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/getoneuser").post(getUserById);
router.route("/getallusers").get(getAllUsers);
//secured routes

router.route("/refreshToken").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
