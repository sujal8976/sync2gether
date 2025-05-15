import prisma from "../../db";

export class MessageService {
  private constructor() {}

  static async createMessage(userId: string, roomId: string, message: string) {
    try {
      return await prisma.chat.create({
        data: { userId, roomId, message },
        select: {
            id: true,
            createdAt: true,
        }
      });
    } catch (error) {
      throw new Error("Failed to create chat");
    }
  }
}
