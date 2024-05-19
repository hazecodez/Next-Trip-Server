import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();

// for upload package images to cloudinary

export const uploadFiles = async (
  files: string[],
  folder: string
): Promise<string[] | undefined> => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const publicIds: string[] = [];
    for (const file of files) {
      const response = await cloudinary.uploader.upload(file, {
        folder: `Next-Trip/${folder}`,
      });
      publicIds.push(response.public_id);
    }
    return publicIds;
  } catch (error) {
    console.log("Error occurred when uploading images to Cloudinary.", error);
    return undefined;
  }
};


export const uploadSingleFile = async (
  file: string,
  folder: string
): Promise<string | undefined> => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const response = await cloudinary.uploader.upload(file, {
      folder: `Next-Trip/${folder}`,
    });
    return response.public_id;
  } catch (error) {
    console.log(
      "Error occurred when uploading profile image to Cloudinary.",
      error
    );
    return undefined;
  }
};


