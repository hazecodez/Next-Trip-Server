interface IChatUseCase {
  newConversation(senderId: string, receiverId: string): Promise<any>;
  getConversations(id: string): Promise<any>;
  getMessages(id: string): Promise<any>;
  addMessage(message: object): Promise<any>;
  findUserById(userId: string, who: string): Promise<any>;
}

export default IChatUseCase;
