import { check, oneOf} from "express-validator";

// Email validation regex
const emailRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;
// Phone number validation regex (simple example, adjust as needed)
const phoneRegex =/^(?:\+?\d{1,3}[-.\s]?)?\(?[1-9]\d{1,2}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/


export const userInputValidation = [
    oneOf([
        check('id')
            .exists()
            .withMessage('Must be a valid email or phone number')
            .isLength({ min: 3 })
            .matches(phoneRegex)
            .withMessage('email or phone not valid'),

        check('id')
            .exists()
            .withMessage('Must be a valid email or phone number')
            .isEmail()
            .withMessage('email or phone not valid'),
    ]),
    check('password')
        .isString()
        .exists()
        .withMessage('password is required')
        .isLength({ min: 3 })
];



