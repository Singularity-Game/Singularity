import { Injectable } from '@nestjs/common';
import { VideoInfo } from '@singularity/api-interfaces';
import * as ytdl from 'ytdl-core';

@Injectable()
export class YtService {

  public async getInfo(id: string): Promise<VideoInfo> {
    const ytdlVideoInfo = await ytdl.getBasicInfo(id);
    const videoInfo = new VideoInfo();

    videoInfo.url = ytdlVideoInfo.videoDetails.video_url;
    videoInfo.title = ytdlVideoInfo.videoDetails.title;
    videoInfo.author = ytdlVideoInfo.videoDetails.author.name;
    videoInfo.thumbnailUrl = ytdlVideoInfo.videoDetails.thumbnails.reduce((largestThumbnail: ytdl.thumbnail, currentThumbnail: ytdl.thumbnail) => {
      const largestThumbnailSize = largestThumbnail.width * largestThumbnail.height;
      const currentThumbnailSize = currentThumbnail.width * currentThumbnail.height;

      if (largestThumbnailSize > currentThumbnailSize) {
        return largestThumbnail;
      } else {
        return currentThumbnail;
      }
    }).url;
    videoInfo.authorThumbnailUrl = ytdlVideoInfo.videoDetails.author.avatar;

    return videoInfo;
  }
}
