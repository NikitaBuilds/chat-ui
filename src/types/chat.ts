export interface Message {
  role: string;
  content: string;
  id?: string;
  isStreaming?: boolean;
  suggestions?: string[];
  images?: ChatImage[];
  error?: boolean;
}

export interface ChatImage {
  id: string;
  url: string;
  file?: File;
  preview?: string;
  base64?: string;
}
