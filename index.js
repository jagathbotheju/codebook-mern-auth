require("dotenv").config();
require("colors");
require("./utils/passport");
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import passport from "passport";

//middleware
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

//rutes
app.use("/user", userRoutes);

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
