import { Schema, model } from "mongoose";
import traveler from "../../domain/traveler";

const travelerSchema: Schema<traveler> = new Schema({
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
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  wallet: {
    type: Number,
    default: 0,
  },
});

const travelerModel = model<traveler>("traveler", travelerSchema);
export default travelerModel;
