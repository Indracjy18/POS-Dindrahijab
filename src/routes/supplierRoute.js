import { Router } from "express";
import { isAuth } from "../controllers/errorController.js";
import {
  createSupplier,
  deleteSupplier,
  generateExcel,
  generatePdf,
  getAllSupplier,
  getSupplierById,
  updateSupplier,
} from "../controllers/supplierController.js";
const supplierRoute = Router();

supplierRoute.get("/suppliers", isAuth, getAllSupplier);
supplierRoute.get("/suppliers/:id", isAuth, getSupplierById);
supplierRoute.post("/suppliers", isAuth, createSupplier);
supplierRoute.put("/suppliers/:id", isAuth, updateSupplier);
supplierRoute.delete("/suppliers/:id", deleteSupplier);
supplierRoute.get("/suppliers-pdf", isAuth, generatePdf);
supplierRoute.get("/suppliers-excel", isAuth, generateExcel);

export default supplierRoute;
