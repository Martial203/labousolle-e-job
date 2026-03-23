import { DocumentType } from "../../enums/document-type/document-type";

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
  document?: Attachment;
  paymentUrl?: string;
}

export interface ChatGroupedByPeriod {
  today: ChatHeader[];
  lastWeek: ChatHeader[];
  lastMonth: ChatHeader[];
}

export interface MessageInput {
  content: string;
  file?: { file: File, type: 'cv'|'profile' };
}

export interface Attachment {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  isPreview: boolean;
}