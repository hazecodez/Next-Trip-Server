import Blog from "../domain/blog";
import IBlogRepo from "./interface/IBlogRepo";
import { uploadSingleFile } from "../infrastructure/utils/cloudinary";
import Jwt from "../infrastructure/utils/jwt";

export default class BlogUseCase {
  private blogRepo: IBlogRepo;
  private Jwt: Jwt;
  constructor(blogRepo: IBlogRepo, jwt: Jwt) {
    this.blogRepo = blogRepo;
    this.Jwt = jwt;
  }
  
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async createBlog(form: Blog, image: string, token: string, name:string) {
    try {
      const blogImage = await uploadSingleFile(image, "Blogs");
      const user = this.Jwt.verifyToken(token);
      const created = await this.blogRepo.createBlog(
        form,
        blogImage as string,
        user?.id,
        name
      );
      if (created) {
        return {
          status: true,
          message: "Blog posted successfully.",
        };
      } else {
        return {
          status: false,
          message: "Oops!! Something went wrong. try again.",
        };
      }
    } catch (error) {
      console.log("Error creating blog:", error);
      throw new Error("Failed to create blog. Please try again.");
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async fetchBlogs(page:number) {
    try {
      const response = await this.blogRepo.fetchBlogs(page);
      if (response) {
        return {
          status: true,
          blogs: response,
        };
      } else {
        return {
          status: false,
          message: "No Blogs found.",
        };
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch blogs. Please try again.");
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async fetchblogDetails(id: string) {
    try {
      const response = await this.blogRepo.fetchBlogDetails(id);
      if (response) {
        return {
          status: true,
          details: response,
        };
      } else {
        return {
          status: false,
          message: "Unable to fetch details",
        };
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch blog details of ${id}. Please try again.`
      );
    }
  }
  
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async fetchBlogsByUser(token: string) {
    try {
      const user = this.Jwt.verifyToken(token);
      const response = await this.blogRepo.fetchBlogsByUser(user?.id);
      if (response) {
        return {
          status: true,
          blogs: response,
        };
      } else {
        return {
          status: false,
          message: "No Blogs.",
        };
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch blog details of specific user. Please try again.`
      );
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async commentBlog(comment: string, blogId: string, token: string) {
    try {
      const user = this.Jwt.verifyToken(token);
      const response = await this.blogRepo.comment_blog(
        comment,
        user?.id,
        blogId
      );
      if (response) {
        return {
          status: true,
          message: `Commented on ${response}`,
        };
      } else {
        return {
          status: false,
          message: `Failed to Comment.`,
        };
      }
    } catch (error) {
      throw new Error(
        `Failed to coment on ${blogId}'s blog . Please try again.`
      );
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async likeAndUnlikeBlog(token: string, blogId: string) {
    try {
      const user = this.Jwt.verifyToken(token);
      const response = await this.blogRepo.like_unlike_blog(user?.id, blogId);
      if (response) {
        return {
          status: true,
          message: `You've ${response.action} on ${response.caption}`,
        };
      } else {
        return {
          status: false,
          message: "something went wrong.try again",
        };
      }
    } catch (error) {
      throw new Error(
        `Failed to like or unlike on ${blogId}'s blog . Please try again.`
      );
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async removeBlog(blogId: string) {
    try {
      const response = await this.blogRepo.removeBlog(blogId);
      if (response) {
        return {
          status: true,
          message: `You've successfully deleted ${response}.`,
        };
      } else {
        return {
          status: false,
          message: "something went wrong.try again",
        };
      }
    } catch (error) {
      throw new Error(`Failed to remove ${blogId}'s blog . Please try again.`);
    }
  }
  
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
}
