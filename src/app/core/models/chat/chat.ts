export class ChatHeader {
  id!: string;
  title!: string;
  date!: Date;
  documentType!: DocumentType;
  language!: string;
  status!: string;
}

export class ChatMessage {
  sender!: 'user' | 'agent';
  content!: string;
  date!: Date;
  chatId!: string;
}

export interface ChatGroupedByPeriod {
  today: ChatHeader[];
  lastWeek: ChatHeader[];
  lastMonth: ChatHeader[];
}