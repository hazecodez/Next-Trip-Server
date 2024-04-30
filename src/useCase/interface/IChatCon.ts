import { Request, Response } from "express";

interface IChatController {
  newConversation(req: Request, res: Response): Promise<void>;
  getMessages(req: Request, res: Response): Promise<void>;
  getConversations(req: Request, res: Response): Promise<void>;
  addMessage(req: Request, res: Response): Promise<void>;
  findUserById(req: Request, res: Response): Promise<void>;
}

export default IChatController;
