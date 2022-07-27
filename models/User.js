import { Schema, model } from "mongoose";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import lodash from "lodash";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpiresIn: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  user.password = await hash(user.password, 10);
  next();
});

userSchema.methods.comparePasswords = async function (password) {
  return await compare(password, this.password);
};

userSchema.methods.generateJWT = async function () {
  const payload = {
    username: this.username,
    emil: this.email,
    name: this.name,
    id: this._id,
  };
  return await jwt.sign(payload, process.env.APP_SECRET, { expiresIn: "1day" });
};

//expires in one hour
userSchema.methods.generatePasswordResetToken = function () {
  this.resetPasswordExpiresIn = Date.now() + 360000000;
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
};

userSchema.methods.getUserInfo = function () {
  return lodash.pick(this, ["_id", "username", "email", "name", "verified"]);
};

const User = model("users", userSchema);
export default User;
