export interface Chat {
  id: string;
  message: string;
  user: {
    id: string;
    username: string;
  };
  createdAt: Date;
  tempId?: string;
}


export interface ChatResponse {
  success: boolean;
  chats: Chat[];
  totalCount: number;
  currentPage: number;
  totalPage: number;
  hasMore: boolean;
}
