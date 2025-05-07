import {z} from 'zod';
import { WebSocketMessageType } from '../types/websocket';

const joinRoomSchema = z.object({
    type: z.literal(WebSocketMessageType.JOIN_ROOM),
    payload: z.object({
        roomId: z.string()
    })
})

const leaveRoomSchema = z.object({
    type: z.literal(WebSocketMessageType.LEAVE_ROOM),
    payload: z.object({
        roomId: z.string()
    })
})

export class WebSocketMessageSchemas {
    static joinRoomSchema = joinRoomSchema;
    static leaveRoomSchema = leaveRoomSchema;
}