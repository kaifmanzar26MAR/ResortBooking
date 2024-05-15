import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import { dbConnection } from "./database/dbConnection.js";
import userRouter from './routes/user.routes.js'
import bodyParser from "body-parser";
import path from "path";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config({ path: "backend/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
const __dirname = path.resolve();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/users",userRouter)
app.get("/api", (req, res)=>{return res.status(200).json({
  success: true,
  message: {
    Author:"MD Kaif Manzar",
    Designation:"Full Stack Web Dev-- MERN",
    Contact:"6200561062",
    Email:"kaifmanzar321@gmail.com"
  }
})})
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})

app.use(express.static(path.join(__dirname, "/frontend/dist")));

dbConnection();

app.use(errorMiddleware);

export default app;
