import { Nullable } from '../shared/nullable';
import { VideoInfo } from './video-info';

export class SongUploadInfo {
  isVideoDownloadable = false;
  videoInfo: Nullable<VideoInfo> = null;
}
