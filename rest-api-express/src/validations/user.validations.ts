import {body} from "express-validator";

export const passwordValidation = body('password').isString().trim().notEmpty().isLength({min:3,max:20})
export const idValidation = body('id').isString().trim().notEmpty().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')


export const userInputValidations = [idValidation, passwordValidation]