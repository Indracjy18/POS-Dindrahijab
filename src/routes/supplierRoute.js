import { Router } from "express";
import { isAuth } from "../controllers/errorController.js";
import {
  createSupplier,
  deleteSupplier,
  getAllSupplier,
  getSupplierById,
  updateSupplier,
} from "../controllers/supplierController.js";
const supplierRouter = Router();

supplierRouter.get("/suppliers", isAuth, getAllSupplier);
supplierRouter.get("/suppliers/:id", isAuth, getSupplierById);
supplierRouter.post("/suppliers", isAuth, createSupplier);
supplierRouter.put("/suppliers/:id", isAuth, updateSupplier);
supplierRouter.delete("/suppliers/:id", deleteSupplier);

export default supplierRouter;
