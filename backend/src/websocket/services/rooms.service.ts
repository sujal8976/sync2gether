import prisma from "../../db";

export class RoomService {
  private constructor() {}

  static async getOnlineRoomMembers(roomId: string) {
    try {
      const roomUsers = await prisma.roomMembers.findMany({
        where: {
          roomId,
        },
        select: {
          userId: true,
        },
      });

      if (!roomUsers) return [];

      return roomUsers;
    } catch (error) {
      throw new Error("Failed to get room members");
    }
  }

  static async addUserToRoom(userId: string, roomId: string) {
    try {
      if (
        await prisma.roomMembers.findFirst({
          where: { userId, roomId },
        })
      ) {
        return "ALREADY_JOINED";
      } else {
        await prisma.roomMembers.create({
          data: {
            userId,
            roomId,
          },
        });

        return "ADDED";
      }
    } catch (error) {
      return "FAILED";
    }
  }

  static async removeUserFromRoom(userId: string, roomId: string): Promise<boolean> {
    try {
      await prisma.roomMembers.delete({
        where: {
          userId_roomId: {
            userId,
            roomId
          }
        }
      })

      return true;
    } catch (error) {
      return false;
    }
  }
}
