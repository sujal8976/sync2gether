import prisma from "../../db";

export class UserService {
    private constructor() {}
  
    static async updateUserStatus(
      userId: string,
      isOnline: boolean
    ): Promise<void> {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isOnline },
        });
      } catch (error) {
        throw new Error("Failed to update user status");
      }
    }
  }