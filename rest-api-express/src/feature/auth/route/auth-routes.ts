import { Router} from "express";
import {authValidations} from "../../../validations/auth-validations";
import {
    userInputValidations
} from "../../../validations/user-validations";

import {checkRefreshTokenMiddleware} from "../../../middlewares/check-refreshToken-middleware";
import {container} from "../../../composition-root";
import {AuthController} from "../api/auth.controller";
import {checkAccessTokenMiddleware} from "../../../middlewares/check-accessToken-middleware";
import {inputValidationErrorsMiddleware} from "../../../middlewares/input-validation-errors-middleware";


export const authRoutes = Router({});

const authController = container.resolve(AuthController)


authRoutes.post('/signin',  userInputValidations, inputValidationErrorsMiddleware,
    authController.signin.bind(authController));

authRoutes.post('/signin/new_token', checkRefreshTokenMiddleware,
    authController.refreshToken.bind(authController));

authRoutes.post('/signup', authValidations, inputValidationErrorsMiddleware,
    authController.signup.bind(authController));

authRoutes.get('/logout', checkAccessTokenMiddleware,
    authController.logout.bind(authController));

authRoutes.get('/info', checkAccessTokenMiddleware,
    authController.userInfo.bind(authController));



// authRoutes.get('/me', checkRefreshTokenMiddleware, authController.getCurrentUser.bind(authController))


//
// authRoutes.post('/logout', checkRefreshTokenMiddleware,
//     authController.logout.bind(authController));





