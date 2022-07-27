import { Router } from "express";
import {
  register,
  verifyEmailAddress,
  authenticateUser,
  getAuthenticatedUser,
  resetPasswordRequest,
  resetPassword,
  resetPasswordSendForm,
} from "../controllers/user";
import {
  RegisterValidations,
  AuthenticateValidations,
  ResetPasswordValidations,
} from "../utils/userValidators";
import validationMiddleware from "../middleware/validationMiddleware";
import passport from "passport";
import { userAuth } from "../middleware/authMiddleware";

const router = Router();

/**
 * @description Reset Password
 * @api /user/reset-password/
 * @access Public
 * @type PUT
 */
router.put(
  "/reset-password-request",
  ResetPasswordValidations,
  validationMiddleware,
  resetPasswordRequest
);

/**
 * @description Reset Password request
 * @api /user/reset-password/:resetPasswordToken
 * @access Private via email only
 * @type GET
 */
router.get("/reset-password-form/:resetPasswordToken", resetPasswordSendForm);

router.post("/reset-password", resetPassword);

/**
 * @description Get authenticated user info
 * @api /user/authenticate
 * @access Private
 * @type GET
 */
router.get("/authenticate", userAuth, getAuthenticatedUser);

/**
 * @description Authenticate user/login and get access token
 * @api /user/authenticate
 * @access Public
 * @type POST
 */
router.post(
  "/authenticate",
  AuthenticateValidations,
  validationMiddleware,
  authenticateUser
);

/**
 * @description create new user account
 * @api /user/register
 * @access Public
 * @type POST
 */
router.post("/register", RegisterValidations, validationMiddleware, register);

/**
 * @description Verify email address
 * @api /user/verify-now/verificationToken
 * @access Public
 * @type GET
 */
router.get("/verify-now/:verificationToken", verifyEmailAddress);

export default router;
