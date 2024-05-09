import { Booking, Status } from "../../domain/booking";
import { Schema, model } from "mongoose";

const bookingSchema: Schema<Booking> = new Schema({
  packageName:{
    type: String,
    required:true
  },
  travelerId: {
    type: String,
    required: true,
  },
  packageId: {
    type: String,
    required: true,
  },
  travelers: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        age: {
          type: Number,
          required: true,
        },
        gender: {
          type: String,
          enum: ["Male", "Female", "Other"],
          required: true,
        },
      },
    ],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    required: true,
  },
});

const bookingModel = model<Booking>("booking", bookingSchema);
export default bookingModel;
