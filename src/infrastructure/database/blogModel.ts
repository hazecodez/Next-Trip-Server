import Blog from "../../domain/blog";
import { Schema, model } from "mongoose";

const blogSchema: Schema<Blog> = new Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    liked_users: {
      type: [String],
      default: [],
    },
    isBlocked:{
      type:Boolean,
      default:false
    },
    comments: {
      type: [
        {
          senderId: String,
          comment: String,
          time: Date,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const blogModel = model<Blog>("blog", blogSchema);
export default blogModel;
