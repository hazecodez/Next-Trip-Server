import Blog from "../../domain/blog";

export default interface IBlogRepo {
  createBlog(data: Blog, image: string, userId: string,name:string): Promise<Boolean>;
  fetchBlogs(page:number): Promise<any>;
  fetchBlogsByUser(userId: string): Promise<Blog[] | null | undefined>;
  fetchBlogDetails(blogId: string): Promise<Blog | null | undefined>;
  like_unlike_blog(
    userId: string,
    blogId: string
  ): Promise<{ caption: string; action: string } | null>;
  comment_blog(
    comment: string,
    userId: string,
    blogId: string
  ): Promise<string | null>;
  removeBlog(blogId: string): Promise<string|null>;
}
