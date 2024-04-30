import { Schema, model } from "mongoose";
import Conversation from "../../domain/conversation";

const conversationSchema: Schema<Conversation> = new Schema(
  {
    members: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const conversationModel = model<Conversation>(
  "conversation",
  conversationSchema
);
export default conversationModel;