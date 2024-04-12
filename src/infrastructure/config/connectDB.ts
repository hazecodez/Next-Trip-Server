import mongoose from "mongoose";

export const connectDB = () => {
  try {
    const mongoURI = process.env.MONGO_URL as string;
    mongoose
      .connect(mongoURI)
      .then(() => {
        console.log("Database Connected");
      })
      .catch((error) => {
        console.log(error, ": Connection Error");
      });
  } catch (error) {
    console.log(error);
  }
};
