import { Injectable } from '@nestjs/common';
import { VideoInfo } from '@singularity/api-interfaces';
import { chooseFormat, Thumbnail, VideoFormat, Ytdl, VideoInfo as YtdlVideoInfo } from '@distube/ytdl-core';
import { SongFile } from './interfaces/song-file';

@Injectable()
export class YtService {

  private readonly ytdl = new Ytdl();

  public async getInfo(id: string): Promise<VideoInfo> {
    const ytdlVideoInfo = await this.ytdl.getInfo(id);
    const videoInfo = new VideoInfo();

    videoInfo.id = id;
    videoInfo.url = ytdlVideoInfo.videoDetails.url;
    videoInfo.title = ytdlVideoInfo.videoDetails.title;
    videoInfo.author = ytdlVideoInfo.videoDetails.author.name;
    videoInfo.thumbnailUrl = ytdlVideoInfo.videoDetails.thumbnails.reduce((largestThumbnail: Thumbnail, currentThumbnail: Thumbnail) => {
      const largestThumbnailSize = (largestThumbnail.width ?? 0) * (largestThumbnail.height ?? 0);
      const currentThumbnailSize = (currentThumbnail.width ?? 0) * (currentThumbnail.height ?? 0);

      if (largestThumbnailSize > currentThumbnailSize) {
        return largestThumbnail;
      } else {
        return currentThumbnail;
      }
    }).url;

    if (ytdlVideoInfo.videoDetails.author.thumbnails) {
      videoInfo.authorThumbnailUrl = ytdlVideoInfo.videoDetails.author.thumbnails[0].url;
    }

    return videoInfo;
  }

  public async downloadVideo(id: string): Promise<SongFile> {
    const info = await this.ytdl.getInfo(id);
    const format = chooseFormat(info.formats, { quality: 'highestvideo' });

    const buffer = await this.download(info, format);

    return new SongFile(buffer, info.videoDetails.title + '.mp4');
  }

  public async downloadAudo(id: string): Promise<SongFile> {
    const info = await this.ytdl.getInfo(id);
    const format = chooseFormat(info.formats, { quality: 'highestaudio' });

    const buffer = await this.download(info, format);

    return new SongFile(buffer, info.videoDetails.title + '.mp3');
  }

  private async download(info: YtdlVideoInfo, format: VideoFormat): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const stream = this.ytdl.download(info.videoDetails.url, { format: format })
      const chunks: Uint8Array[] = [];
      stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (error: Error) => {
        reject(error);
      });
    })
  }
}
