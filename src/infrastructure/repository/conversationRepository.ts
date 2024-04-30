import IConversationRepo from "../../useCase/interface/IConversationRepo";
import conversationModel from "../database/conversationModel";
import hostModel from "../database/hostModel";
import travelerModel from "../database/travelerModel";

class conversationRepository implements IConversationRepo {
  async saveNewConversation(
    senderId: string,
    receiverId: string
  ): Promise<any> {
    try {
      const found = await conversationModel.findOne({
        members: { $all: [senderId, receiverId] },
      });
      if (found) return found;

      const newConversation = new conversationModel({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      return newConversation;
    } catch (error) {
      console.log(error);
    }
  }

  async getConversations(id: string): Promise<any> {
    try {
      const conversations = await conversationModel.find({
        members: { $in: [id] },
      });
      if (conversations) {
        return conversations;
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }

  async findUserById(userId: string, who: string): Promise<any> {
    try {
      if (who === "traveler") {
        const found = await hostModel.findById(userId, { name: 1 });
        return found;
      }
      const found = await travelerModel.findById(userId, { name: 1 });
      return found;
    } catch (error) {
      console.log(error);
    }
  }
}

export default conversationRepository;
