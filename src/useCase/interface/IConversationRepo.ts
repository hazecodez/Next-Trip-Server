interface IConversationRepo {
  saveNewConversation(senderId: string, receiverId: string): Promise<any>;
  getConversations(id: string): Promise<any>;
  findUserById(userId: string, who: string): Promise<any>;
}
export default IConversationRepo;
