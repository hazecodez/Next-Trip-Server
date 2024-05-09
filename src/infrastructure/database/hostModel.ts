import { Schema, model } from "mongoose";
import host from "../../domain/host";

const hostSchema: Schema<host> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  identityImage: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  wallet: {
    type: Number,
    default: 0,
  },
  googleId: {
    type: String,
  },
  walletHistory: {
    type: [
      {
        packageName: String,
        travelerName: String,
        amount: Number,
        status: String,
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
});

const hostModel = model<host>("host", hostSchema);
export default hostModel;
