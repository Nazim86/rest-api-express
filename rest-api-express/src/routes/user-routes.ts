import {Router} from "express";

import {container} from "../composition-root";
import {UserController} from "../feature/user/api/user.controller";

export const userRoutes = Router({})

const userController = container.resolve(UserController)

// userRoutes.get("/", baseAuthorizationMiddleware, userController.getUsers.bind(userController))
//
// userRoutes.post("/", baseAuthorizationMiddleware, userInputValidations, checkUserCredentialsMiddleware, inputValidationErrorsMiddleware,
//     userController.createUser.bind(userController))
//
// userRoutes.delete("/:id", baseAuthorizationMiddleware, userController.deleteUser.bind(userController))
