import { Router } from "express";
import userRouter from "./userRoute.js";
import categoryRoute from "./categoryRoute.js";
import supplierRouter from "./supplierRoute.js";
const router = Router();

router.use("/api", userRouter);
router.use("/api", categoryRoute);
router.use("/api", supplierRouter);
export default router;
