import { Router} from "express";
import {authValidations} from "../../../validations/auth.validations";
import {
    userInputValidation,
} from "../../../validations/user.validations";

import {checkRefreshTokenMiddleware} from "../../../middlewares/check-refreshToken.middleware";
import {container} from "../../../composition-root";
import {AuthController} from "../api/auth.controller";
import {checkAccessTokenMiddleware} from "../../../middlewares/check-accessToken.middleware";
import {inputValidationErrorsMiddleware} from "../../../middlewares/input-validation-errors.middleware";
import {checkUserCredentialsMiddleware} from "../../../middlewares/check-user-credentials.middleware";


export const authRoutes = Router({});

const authController = container.resolve(AuthController)


authRoutes.post('/signin',  authValidations, inputValidationErrorsMiddleware,
    authController.signin.bind(authController));

authRoutes.post('/signin/new_token', checkRefreshTokenMiddleware,
    authController.refreshToken.bind(authController));

authRoutes.post('/signup',userInputValidation , inputValidationErrorsMiddleware,checkUserCredentialsMiddleware,
    authController.signup.bind(authController));

authRoutes.get('/logout', checkAccessTokenMiddleware,
    authController.logout.bind(authController));

authRoutes.get('/info', checkAccessTokenMiddleware,
    authController.userInfo.bind(authController));





