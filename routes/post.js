import { Router } from "express";
import { userAuth } from "../middleware/authMiddleware";
import User from "../models/User";
import Post from "../models/Post";
import uploader from "../middleware/uploaderMiddleware";
import {
  createPost,
  postImageUpload,
  updatePost,
  likePost,
} from "../controllers/post";
import { PostValidations } from "../utils/postValidators";
import validatorMiddleware from "../middleware/validationMiddleware";
import { uploadPostImage } from "../middleware/uploaderMiddleware";

const router = Router();

router.put("/like-post/:id", userAuth, likePost);

/**
 * @description update post
 * @api /posts/update-post
 * @access Private
 * @type PUT
 */
router.put(
  "/update-post/:id",
  userAuth,
  PostValidations,
  validatorMiddleware,
  updatePost
);

/**
 * @description upload post image
 * @api /posts/post-image-upload
 * @access Private
 * @type POST
 */
router.post(
  "/post-image-upload",
  userAuth,
  uploadPostImage.single("image"),
  postImageUpload
);

/**
 * @description create post
 * @api /posts/create-post
 * @access Private
 * @type POST
 */
router.post(
  "/create-post",
  userAuth,
  PostValidations,
  validatorMiddleware,
  createPost
);

export default router;
