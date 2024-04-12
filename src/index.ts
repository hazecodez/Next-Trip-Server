import { connectDB } from "./infrastructure/config/connectDB";
import { createServer } from "./infrastructure/config/app";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

const startServer = async () => {
  try {
    connectDB();
    const app = createServer();
    app?.listen(5050, () => {
      console.log(`Server running on ${"http://localhost:5050"}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
