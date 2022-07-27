import { Router } from "express";
import {
  createProfile,
  myProfile,
  updateProfile,
  getProfileByUserName,
} from "../controllers/profile";
import { userAuth } from "../middleware/authMiddleware";
import uploader from "../middleware/uploaderMiddleware";

const router = Router();

/**
 * @description get profile by username
 * @api /profile/profile-username
 * @access Public
 * @type GET
 */
router.get("/profile-username/:username", getProfileByUserName);

/**
 * @description update profile
 * @api /profile/update-profile
 * @access Private
 * @type PUT <multipart-form> request
 */
router.put(
  "/update-profile",
  uploader.single("avatar"),
  userAuth,
  updateProfile
);

/**
 * @description get profile
 * @api /profile/my-profile
 * @access Private
 * @type GET <multipart-form> request
 */
router.get("/my-profile", userAuth, myProfile);

/**
 * @description create profile of authenticated user
 * @api /profile/create-profile
 * @access Private
 * @type POST <multipart-form> request
 */
router.post(
  "/create-profile",
  userAuth,
  uploader.single("avatar"),
  createProfile
);

export default router;
