import { Schema, model } from "mongoose";
import Otp from "../../domain/otp";

const OtpSchema = new Schema({
  otp: {
    type: String,
  },
  email: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: 60,
    default: Date.now,
  },
});

OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = model<Otp>("otp", OtpSchema);
export default otpModel;
