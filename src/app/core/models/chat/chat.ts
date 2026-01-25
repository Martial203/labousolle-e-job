export class ChatHeader {
  id!: number;
  title!: string;
  date!: Date;
}

export class ChatMessage {
  id!: number;
  sender!: 'user' | 'agent';
  content!: string;
  date!: Date;
  chatId!: number;
}
