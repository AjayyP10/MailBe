export interface Email {
  id: string;
  subject: string;
  from: string;
  body: string;
  receivedAt: string;
  category: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
}