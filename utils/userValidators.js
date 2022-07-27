import { check } from "express-validator";

const nameCheck = check("name", "Name is required").not().isEmpty();
const userNameCheck = check("username", "User Name is required")
  .not()
  .isEmpty();
const passwordCheck = check(
  "password",
  "password is required of min length 6"
).isLength({
  min: 6,
});
const emailCheck = check("email", "Please enter valid email address").isEmail();

export const RegisterValidations = [
  nameCheck,
  userNameCheck,
  passwordCheck,
  emailCheck,
];
export const AuthenticateValidations = [userNameCheck, passwordCheck];
export const ResetPasswordValidations = [emailCheck];
