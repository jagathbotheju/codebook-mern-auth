import Profile from "../models/Profile";
import User from "../models/User";

export const getProfileByUserName = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const profile = await Profile.findOne({ account: user._id });
    return res.status(200).json({
      success: true,
      profile: {
        ...profile.toObject(),
        account: user.getUserInfo(),
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Ueexpected error, Unable to get user",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { body, file, user } = req;
    const path = process.env.APP_DOMAIN + file.path.split("uploads")[1];
    const profile = await Profile.findOneAndUpdate(
      { account: user._id },
      { social: body, avatar: path },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ account: req.user._id }).populate(
      "account",
      "name email username"
    );
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Your profile is not available",
      });
    }
    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to get user profile",
    });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { body, file, user } = req;
    const path = process.env.APP_DOMAIN + file.path.split("uploads")[1];
    const profile = new Profile({
      social: body,
      account: user._id,
      avatar: path,
    });
    await profile.save();
    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to create profile",
    });
  }
};
