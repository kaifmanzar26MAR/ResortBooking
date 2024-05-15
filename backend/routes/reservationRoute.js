import express from "express";
import send_reservation from "../controller/reservation.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createreservation",verifyJWT, send_reservation);

export default router;
