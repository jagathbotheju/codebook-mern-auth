import { Schema, model } from "mongoose";
import Paginator from "mongoose-paginate-v2";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      count: {
        type: Number,
        default: 0,
      },
      user: [
        {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
      ],
    },
    image: {
      type: String,
      required: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
  },
  { timestamps: true }
);

postSchema.plugin(Paginator);
const Post = model("posts", postSchema);
export default Post;
