import {body} from "express-validator";

export const passwordValidation = body("password").isString().trim().notEmpty()
export const idValidation = body("id").isString().trim().notEmpty()


export const authValidations = [idValidation,passwordValidation]