import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/kategoriController.js";
import { isAuth } from "../controllers/errorController.js";
const categoryRoute = Router();

categoryRoute.get("/category", isAuth, getAllCategory);
categoryRoute.get("/category/:id", isAuth, getCategoryById);
categoryRoute.post("/category", isAuth, createCategory);
categoryRoute.put("/category/:id", isAuth, updateCategory);
categoryRoute.delete("/category/:id", isAuth, deleteCategory);

export default categoryRoute;
