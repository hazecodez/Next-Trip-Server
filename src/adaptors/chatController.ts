import { Request, Response } from "express";
import Jwt from "../infrastructure/utils/jwt";
import chatUseCase from "../useCase/chatUseCase";

class chatController {
  private chatUseCase: chatUseCase;
  private Jwt: Jwt;
  constructor(chatUseCase: chatUseCase, Jwt: Jwt) {
    this.chatUseCase = chatUseCase;
    this.Jwt = Jwt;
  }

  async newConversation(req: Request, res: Response): Promise<void> {
    try {
      const sender = this.Jwt.verifyToken(req.headers.authorization as string);
      if (sender) {
        const receiverId = req.query.hostId as string;
        const newConversation = await this.chatUseCase.newConversation(
          sender.id,
          receiverId
        );
        res.status(200).json(newConversation);
      } else {
        res.json({ message: "Didn't verify traveler token." }).status(401);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const messages = await this.chatUseCase.getMessages(
        req.body.conversationId as string
      );
      res.status(200).json(messages);
    } catch (error) {
      console.log(error);
    }
  }
  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const id = req.query.userId as string;
      const conversations = await this.chatUseCase.getConversations(id);
      res.status(200).json(conversations.data);
    } catch (error) {
      console.log(error);
    }
  }
  async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const message = await this.chatUseCase.addMessage(data);
      res.status(200).json(message.data);
    } catch (error) {
      console.log(error);
    }
  }
  async findUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId as string;
      const who = req.body.who as string;

      const found = await this.chatUseCase.findUserById(userId, who);
      res.status(200).json(found);
    } catch (error) {
      console.log(error);
    }
  }
}

export default chatController;
