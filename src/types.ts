export enum ImageStyle {
  PIXEL = 'PIXEL',
  STICK_FIGURE = 'STICK_FIGURE',
}

export type AspectRatio = "1:1" | "9:16" | "16:9" | "4:3" | "3:4";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export interface AppSettings {
  apiKeys: string[];
}