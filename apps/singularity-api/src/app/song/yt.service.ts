import { Injectable } from '@nestjs/common';
import { VideoInfo } from '@singularity/api-interfaces';
import * as ytdl from 'ytdl-core';
import { SongFile } from './interfaces/song-file';

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

    videoInfo.authorThumbnailUrl = ytdlVideoInfo.videoDetails.author.thumbnails[0].url;

    return videoInfo;
  }

  public async downloadVideo(id: string): Promise<SongFile> {
    const info = await ytdl.getInfo(id);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'videoonly' });

    const buffer = await this.download(info, format);

    return new SongFile(buffer, info.videoDetails.title + '.mp4');
  }

  public async downloadAudo(id: string): Promise<SongFile> {
    const info = await ytdl.getInfo(id);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioonly' });

    const buffer = await this.download(info, format);

    return new SongFile(buffer, info.videoDetails.title + '.mp3');
  }

  private async download(info: ytdl.videoInfo, format: ytdl.videoFormat): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const stream = ytdl.downloadFromInfo(info, { format: format });
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', () => reject());
    })
  }
}
