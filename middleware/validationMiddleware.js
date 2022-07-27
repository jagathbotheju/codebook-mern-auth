import { validationResult } from "express-validator";

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      errors: errors.array(),
    });
  }
  next();
};

export default validationMiddleware;
