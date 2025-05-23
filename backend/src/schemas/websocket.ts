import { z } from "zod";
import { WebSocketMessageType } from "../types/websocket";

const joinRoomSchema = z.object({
  type: z.literal(WebSocketMessageType.JOIN_ROOM),
  payload: z.object({
    roomId: z.string(),
  }),
});

const leaveRoomSchema = z.object({
  type: z.literal(WebSocketMessageType.LEAVE_ROOM),
  payload: z.object({
    roomId: z.string(),
  }),
});

const sendMessageSchema = z.object({
  type: z.literal(WebSocketMessageType.SEND_MESSAGE),
  payload: z.object({
    roomId: z.string(),
    userId: z.string(),
    message: z.string(),
  }),
});

const syncPlayerPlaySchema = z.object({
  type: z.literal(WebSocketMessageType.SYNC_PLAYER_PLAY),
  payload: z.object({
    username: z.string(),
    time: z.number(),
    roomId: z.string(),
    videoId: z.string(),
  }),
});

const syncPlayerPauseSchema = z.object({
  type: z.literal(WebSocketMessageType.SYNC_PLAYER_PLAY),
  payload: z.object({
    username: z.string(),
    time: z.number(),
    roomId: z.string(),
    videoId: z.string(),
  }),
});

const videoAddedSchema = z.object({
  type: z.literal(WebSocketMessageType.VIDEO_ADDED),
  payload: z.object({
    id: z.string(),
    youtubeVideoId: z.string(),
    title: z.string(),
    thumbnail: z.string(),
    addedBy: z.string(),
    upVote: z.number(),
    downVote: z.number(),
    userVote: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
    roomId: z.string()
  }),
});

const voteSchema = z.object({
  type: z.literal(WebSocketMessageType.VOTE),
  payload: z.object({
    roomId: z.string(),
    playlistId: z.string(),
    userId: z.string(),
    downvoteDelta: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
    upvoteDelta: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
  })
})

export class WebSocketMessageSchemas {
  static joinRoomSchema = joinRoomSchema;
  static leaveRoomSchema = leaveRoomSchema;
  static sendMessageSchema = sendMessageSchema;
  static syncPlayerPlaySchema = syncPlayerPlaySchema;
  static syncPlayerPauseSchema = syncPlayerPauseSchema;
  static videoAddedSchema = videoAddedSchema;
  static voteSchema = voteSchema;
}
