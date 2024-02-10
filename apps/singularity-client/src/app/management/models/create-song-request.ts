export interface CreateSongRequest {
  txtFile: File;
  audioFile: File;
  videoFile: File;
  coverFile: File;
  start?: number;
  end?: number;
}
