import Post from "../models/Post";
import SlugGenerator from "../utils/slugGenerator";

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const user = post.likes.user.map((id) => id.toString());
    if (user.includes(req.user._id.toString())) {
      return res.status(404).json({
        success: false,
        message: "You already liked this post",
      });
    }
    post = await Post.findOneAndUpdate(
      { _id: id },
      {
        likes: {
          count: post.likes.count + 1,
          user: [...post.likes.user, req.user._id],
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "You liked this post",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Unable to like the post, please try again later",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, body } = req;
    let post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.author.toString() !== user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Post does not belong to you",
      });
    }
    post = await Post.findOneAndUpdate(
      { author: user._id, _id: id },
      {
        ...body,
        slug: SlugGenerator(body.title),
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Unable to update post",
    });
  }
};

export const postImageUpload = (req, res) => {
  try {
    const { file } = req;
    const filename = process.env.APP_DOMAIN + "/post-images/" + file.filename;
    res.status(200).json({
      success: true,
      filename,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to upload image",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { body } = req;
    const post = new Post({
      author: req.user._id,
      slug: SlugGenerator(body.title),
      ...body,
    });
    await post.save();
    //console.log("NEW POST", post);
    return res.status(200).json({
      success: true,
      post,
      message: "Your post is published",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Unable to create post",
    });
  }
};
