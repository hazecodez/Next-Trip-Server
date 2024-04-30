import IMessageRepo from "../../useCase/interface/IMessageRepo";
import messageModel from "../database/messageModel";

class messageRepo implements IMessageRepo {
    
  async saveMessage(data: object): Promise<any> {
    try {
      const message = new messageModel(data);
      const saved = await message.save();
      if (saved) return saved;
      return null;
    } catch (error) {
      console.log(error);
    }
  }
  async getMessages(id: string): Promise<any> {
    try {
      const messages = await messageModel.find({ conversationId: id });
      if (messages) return messages;
      return null;
    } catch (error) {
      console.log(error);
    }
  }
  async getLastMessages(): Promise<any> {
    try {
      const lastMessages = await messageModel.aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: "$conversationId",
            lastMessage: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$lastMessage" },
        },
      ]);
      return lastMessages;
    } catch (error) {
      console.log(error);
    }
  }
}

export default messageRepo;
