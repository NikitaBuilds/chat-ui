export interface Message {
  role: string;
  content: string;
  id?: string;
  isStreaming?: boolean;
  suggestions?: string[];
}
