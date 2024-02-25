import { Nullable } from '@singularity/api-interfaces';
import { VideoInfo } from './video-info';

export class SongUploadInfo {
  isVideoDownloadable = false;
  isCoverDownloadable = false;
  videoInfo: Nullable<VideoInfo> = null;
}
