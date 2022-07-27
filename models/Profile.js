import { Schema, model } from "mongoose";

const profileSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    avatar: {
      type: String,
      required: false,
    },
    social: {
      facebook: {
        type: String,
        required: false,
      },
      twitter: {
        type: String,
        required: false,
      },
      linkedin: {
        type: String,
        required: false,
      },
      instagram: {
        type: String,
        required: false,
      },
      github: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true }
);

const Profile = model("profile", profileSchema);
export default Profile;
