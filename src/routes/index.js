import { Router } from "express";
import userRouter from "./userRoute.js";
import categoryRoute from "./categoryRoute.js";
import supplierRoute from "./supplierRoute.js";
import productRoute from "./productRoute.js";
const router = Router();

router.use("/api", userRouter);
router.use("/api", categoryRoute);
router.use("/api", supplierRoute);
router.use("/api", productRoute);
export default router;
