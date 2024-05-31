import IConversationRepo from "./interface/IConversationRepo";
import IMessageRepo from "./interface/IMessageRepo";

class chatUseCase {
  private CoversationRepo: IConversationRepo;
  private MessageRepo: IMessageRepo;

  constructor(CoversationRepo: IConversationRepo, MessageRepo: IMessageRepo) {
    this.CoversationRepo = CoversationRepo;
    this.MessageRepo = MessageRepo;
  }

  async newConversation(senderId: string, receiverId: string): Promise<any> {
    try {
      const newConversation = await this.CoversationRepo.saveNewConversation(
        senderId,
        receiverId
      );
      if (newConversation) {
        return { status: true, data: newConversation };
      } else {
        return { status: false };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getConversations(id: string): Promise<any> {
    try {
      const conversations = await this.CoversationRepo.getConversations(id);
      return { data: conversations };
    } catch (error) {
      console.log(error);
    }
  }

  async getMessages(id: string): Promise<any> {
    try {
      const messages = await this.MessageRepo.getMessages(id);
      if (messages) return { status: true, data: messages };
      return { status: false, data: "No Messages." };
    } catch (error) {
      console.log(error);
    }
  }

  async addMessage(message: object): Promise<any> {
    try {
      const sendMessage = await this.MessageRepo.saveMessage(message);
      return { data: sendMessage };
    } catch (error) {
      console.log(error);
    }
  }

  async findUserById(userId: string, who: string): Promise<any> {
    try {
      const userName = await this.CoversationRepo.findUserById(userId, who);
      return { status: true, data: userName };
    } catch (error) {
      console.log(error);
    }
  }
}

export default chatUseCase;
