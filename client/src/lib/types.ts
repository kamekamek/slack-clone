export interface Channel {
  id: number;
  name: string;
  createdAt: string;
}

export interface Message {
  id: number;
  channelId: number;
  content: string;
  userName: string;
  createdAt: string;
}
