import { check } from "express-validator";

const titleCheck = check("title", "Title is required").not().isEmpty();
const contentCheck = check("content", "Post content is required")
  .not()
  .isEmpty();

export const PostValidations = [titleCheck, contentCheck];
