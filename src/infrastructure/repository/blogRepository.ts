import Blog from "../../domain/blog";
import blogModel from "../database/blogModel";
import IBlogRepo from "../../useCase/interface/IBlogRepo";

export default class BlogRepo implements IBlogRepo {
  async createBlog(
    data: Blog,
    image: string,
    userId: string,
    name:string
  ): Promise<Boolean> {
    try {
      const created = await blogModel.create({
        caption: data.caption,
        experience: data.experience,
        image: image,
        location: data.location,
        time: new Date(),
        userId: userId,
        userName:name
      });
      if (created) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async fetchBlogs(): Promise<Blog[] | null | undefined> {
    try {
      const blogs = await blogModel.find();
      if (blogs) return blogs;
      return null;
    } catch (error) {
      console.log(error);
    }
  }
  async fetchBlogDetails(blogId: string): Promise<Blog | null | undefined> {
    try {
      const details = await blogModel.findOne({ _id: blogId });
      if (details) return details;
      return null;
    } catch (error) {
      console.log(error);
    }
  }
  async fetchBlogsByUser(userId: string): Promise<Blog[] | null | undefined> {
    try {
      const blogs = await blogModel.find({ userId: userId });
      return blogs;
    } catch (error) {
      console.log(error);
    }
  }

  async comment_blog(
    comment: string,
    userId: string,
    blogId: string
  ): Promise<string | null> {
    try {
      const caption = await blogModel.findOne(
        { _id: blogId },
        { caption: true }
      );
      const newComment = {
        senderId: userId,
        comment: comment,
        time: new Date(),
      };
      const added = await blogModel.findOneAndUpdate(
        { _id: blogId },
        { $push: { comments: newComment } },
        { new: true }
      );
      if (added) return caption?.caption as string;
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async like_unlike_blog(
    userId: string,
    blogId: string
  ): Promise<{ caption: string; action: string } | null> {
    try {
      const blog = await blogModel.findById(blogId);
      if (!blog) {
        return null;
      }
      let action;

      const userIndex = blog.liked_users.indexOf(userId);
      const userLiked = blog.liked_users.includes(userId)
      
      
      if (!userLiked) {
        // User has not liked the blog yet so like the blog
        blog.liked_users.push(userId);
        action = "liked";
      } else {
        // User has already liked the blog so unlike the blog
        blog.liked_users.splice(userIndex, 1);
        action = "unliked";
      }

      await blog.save();
      return {
        caption: blog.caption,
        action: action,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async removeBlog(blogId: string): Promise<string | null> {
    try {
      const blog = await blogModel.findById(blogId);
      const removed = await blogModel.findOneAndDelete({ _id: blogId });
      if (removed) return blog?.caption as string;
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
