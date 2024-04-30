import { Schema, model } from "mongoose";
import Message from "../../domain/message";

const messageSchema: Schema<Message> = new Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = model<Message>("message", messageSchema);
export default messageModel;
