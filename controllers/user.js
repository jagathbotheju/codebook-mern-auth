import User from "../models/User";
import crypto from "crypto";
import sendMail from "../utils/emailSender";
import { join } from "path";

export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email not found",
      });
    }
    user.generatePasswordResetToken();
    await user.save();

    //send password reset link
    const html = `
      <div>
      <h1>Hello, ${user.username}</h1>
      <p>Please click the following link to reset your password</p>
      <p>If this password re-set request, not created by you, please ignore this</p>
      <a href="${process.env.APP_DOMAIN}/user/reset-password-form/${user.resetPasswordToken}">Verify Now</a>
      <p>${process.env.APP_DOMAIN}/user/reset-password-form/${user.resetPasswordToken}</p>
      </div>
    `;

    console.log(`reset token : ${user.resetPasswordToken}`);
    await sendMail(
      user.email,
      "AUTH-APP Rest Password",
      "Re-setting your password",
      html
    );

    return res.status(404).json({
      success: true,
      message: "Pasword re-set link send to your email address",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Reset password error",
    });
  }
};

export const resetPasswordSendForm = async (req, res) => {
  try {
    const { resetPasswordToken } = req.params;
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiresIn: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Password reset link invalid for expired",
      });
    }

    return res.sendFile(join(__dirname, "../utils/password-reset.html"));
  } catch (error) {
    return res.sendFile(join(__dirname, "../utils/errors.html"));
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetPasswordToken, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiresIn: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Password reset link invalid for expired",
      });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresIn = undefined;
    await user.save();
    // Send notification email about the password reset successfull process
    let html = `
        <div>
            <h1>Hello, ${user.username}</h1>
            <p>Your password is resetted successfully.</p>
            <p>If this rest is not done by you then you can contact our team.</p>
        </div>
      `;
    await sendMail(
      user.email,
      "Reset Password Successful",
      "Your password is changed.",
      html
    );
    return res.status(200).json({
      success: true,
      message:
        "Your password reset request is complete and your password is resetted successfully. Login into your account with your new password.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred.",
    });
  }
};

export const getAuthenticatedUser = async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
};

//login
export const authenticateUser = async (req, res) => {
  const { username, password } = req.body;
  //const { email } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User name not found",
      });
    }
    const isPasswordMatch = await user.comparePasswords(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const accessToken = await user.generateJWT();
    return res.status(200).json({
      success: true,
      user: user.getUserInfo(),
      token: `Bearer ${accessToken}`,
      message: "You are now logged in",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error during user authentication",
    });
  }
};

export const verifyEmailAddress = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized Access, Invalid Token",
      });
    }
    user.verified = true;
    user.verificationToken = "";
    await user.save();
    return res.sendFile(join(__dirname, "../utils/verificationSuccess.html"));
  } catch (error) {
    return res.sendFile(join(__dirname, "../utils/errors.html"));
  }
};

export const register = async (req, res) => {
  const { username, email } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User Name is already taken",
      });
    }
    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message:
          "Email is already registered, Did you forget the password?, try reset ",
      });
    }
    user = new User({
      ...req.body,
      verificationToken: crypto.randomBytes(20).toString("hex"),
    });
    await user.save();
    //send email to the user with the verification link
    const html = `
      <div>
      <h1>Hello, ${user.username}</h1>
      <p>Please click the following link to verify your Account</p>
      <a href="${process.env.APP_DOMAIN}/user/verify-now/${user.verificationToken}">Verify Now</a>
      </div>
    `;
    await sendMail(
      user.email,
      "AUTH-APP Verify Account",
      "Please verify your account",
      html
    );
    return res.status(201).json({
      success: true,
      message: "Your Account is created, please verify your email address",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error during user registration",
    });
  }
};
