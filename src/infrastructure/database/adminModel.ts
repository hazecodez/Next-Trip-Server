import { Schema, model } from "mongoose";
import Admin from "../../domain/admin";

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  google_Id: {
    type: String,
  },
});

const adminModel = model<Admin>("admin", adminSchema);
export default adminModel;
