import BlogUseCase from "../useCase/blogUseCase";
import { Request, Response } from "express";

export default class BlogController {
  private blogUseCase: BlogUseCase;
  constructor(blogUseCase: BlogUseCase) {
    this.blogUseCase = blogUseCase;
  }

  async createBlog(req: Request, res: Response) {
    try {
      const name = req.body.name;
      const form = req.body.form;
      const image = req.body.image;
      const token = req.headers.authorization as string;

      const response = await this.blogUseCase.createBlog(form, image, token,name);
      if (response?.status) {
        res
          .status(200)
          .json({ status: response.status, message: response.message });
      } else {
        res
          .json({ status: response.status, message: response.message })
          .status(500);
      }
    } catch (error) {
      throw new Error("Failed to create blog. Please try again.");
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------

  async fetchAllBlogs(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string);
      const response = await this.blogUseCase.fetchBlogs(page);
      if (response?.status) {
        res.status(200).json({
          status: response?.status,
          blogs: response?.blogs,
        });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      throw new Error("Failed to fetch blogs. Please try again.");
    }
  }
  
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async fetchBlogDetails(req: Request, res: Response) {
    try {
      const { blogId } = req.body;
      const response = await this.blogUseCase.fetchblogDetails(blogId);
      if (response?.status) {
        res.status(200).json({
          status: response?.status,
          details: response?.details,
        });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      throw new Error(`Failed to fetch blog details. Please try again.`);
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async fetchBlogsByUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const response = await this.blogUseCase.fetchBlogsByUser(token);
      if (response?.status) {
        res.status(200).json({
          status: response?.status,
          blogs: response?.blogs,
        });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch blog details of specific user. Please try again.`
      );
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async commentBlogByUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const { blogId, comment } = req.body;
      const response = await this.blogUseCase.commentBlog(
        comment,
        blogId,
        token
      );
      if (response?.status) {
        res.status(200).json({
          status: response?.status,
          message: response?.message,
        });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      throw new Error(`Failed to coment on blog . Please try again.`);
    }
  }
  
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async likeAndUnlikeBlogByUser(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const { blogId } = req.body;
      const response = await this.blogUseCase.likeAndUnlikeBlog(token, blogId);
      if (response?.status) {
        res.status(200).json({
          status: response?.status,
          message: response?.message,
        });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      throw new Error(`Failed to like or unlike on blog . Please try again.`);
    }
  }
  
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  
  async removeBlogByUser(req: Request, res: Response) {
    try {   
      const { blogId } = req.body;
      const response = await this.blogUseCase.removeBlog(blogId);
      if (response?.status) {
        res.status(200).json({
          status: response?.status,
          message: response?.message,
        });
      } else {
        res
          .json({ status: response?.status, message: response?.message })
          .status(500);
      }
    } catch (error) {
      throw new Error(`Failed to remove blog . Please try again.`);
    }
  }
}
