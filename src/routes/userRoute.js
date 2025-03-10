import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  loginUser,
  setRefreshToken,
  updateUser,
} from "../controllers/userController.js";
import { isAuth } from "../controllers/errorController.js";
const userRouter = Router();

userRouter.post("/users", createUser);
userRouter.put("/users/:id", isAuth, updateUser);
userRouter.post("/users/login", loginUser);
userRouter.delete("/users/:id", isAuth, deleteUser);
userRouter.get("/users", isAuth, getAllUser);
userRouter.post("/users/refresh", setRefreshToken);
userRouter.get("/users/:id", isAuth, getUserById);

export default userRouter;
