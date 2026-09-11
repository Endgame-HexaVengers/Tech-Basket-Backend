import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { UserControllers } from "./users.controller.js";

const userRouter = Router();

userRouter.post("/register", UserControllers.createUser);
userRouter.post("/login", UserControllers.loginUser);
userRouter.get("/me", auth(), UserControllers.getMe);

userRouter.get("/", UserControllers.getUsers);
userRouter.get("/:id", UserControllers.getUserById);
userRouter.patch("/:id", UserControllers.updateUser);
userRouter.delete("/:id", UserControllers.deleteUser);

export default userRouter;
