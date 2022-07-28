require("dotenv").config();
require("colors");
require("./utils/passport");
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import profileRoutes from "./routes/profile";
import postRoutes from "./routes/post";
import passport from "passport";
import { join } from "path";

//middleware
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(express.static(join(__dirname, "./uploads")));

//rutes
app.use("/user", userRoutes);
app.use("/profile", profileRoutes);
app.use("/post", postRoutes);

const PORT = process.env.APP_PORT;
mongoose
  .connect(process.env.APP_DB)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server statred on port ${PORT} with MongoDB`.yellow.underline
      );
    });
  })
  .catch((error) => console.log(`${error} Did not connect to DB`));
