export interface VideoFormatOption {
  itag: number;
  quality: string;
  resolution: string;
  container: string;
  hasAudio: boolean;
  hasVideo: boolean;
  fps?: number;
  filesizeApprox?: string;
  isHighQuality?: boolean;
}

export interface AudioFormatOption {
  itag: number;
  bitrate: string;
  container: string;
  filesizeApprox?: string;
  label: string;
}

export interface VideoMetadata {
  id: string;
  url: string;
  title: string;
  duration: string;
  durationSeconds: number;
  thumbnail: string;
  channelTitle: string;
  channelUrl: string;
  channelAvatar?: string;
  views: string;
  uploadDate: string;
  videoFormats: VideoFormatOption[];
  audioFormats: AudioFormatOption[];
}

export interface HistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
  url: string;
  timestamp: number;
}

