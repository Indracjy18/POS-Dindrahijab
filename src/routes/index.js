import { Router } from "express";
import userRouter from "./userRoute.js";
import categoryRoute from "./categoryRoute.js";
const router = Router();

router.use("/api", userRouter);
router.use("/api", categoryRoute);
export default router;
