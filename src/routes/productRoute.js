import { Router } from "express";
import { isAuth } from "../controllers/errorController.js";
import { createProduct } from "../controllers/productController.js";
const productRoute = Router();

productRoute.post("/products", isAuth, createProduct);

export default productRoute;
