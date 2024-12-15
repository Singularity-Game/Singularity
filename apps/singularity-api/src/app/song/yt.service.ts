import { Injectable } from '@nestjs/common';
import { VideoInfo } from '@singularity/api-interfaces';
import * as ytdl from '@distube/ytdl-core';
import { SongFile } from './interfaces/song-file';
import { ConfigService } from '@nestjs/config';
import { Agent } from '@distube/ytdl-core';

@Injectable()
export class YtService {

  private readonly agent: Agent;

  constructor(configService: ConfigService) {
    const cookie = configService.get('YOUTUBE_COOKIE');

    if(cookie) {
     this.agent = ytdl.createAgent(JSON.parse(cookie));
    } else {
      this.agent = ytdl.createAgent();
    }
  }

  public async getInfo(id: string): Promise<VideoInfo> {
    const ytdlVideoInfo = await ytdl.getBasicInfo(id, { agent: this.agent });
    const videoInfo = new VideoInfo();

    videoInfo.id = id;
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
    const info = await ytdl.getInfo(id, { agent: this.agent });
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoonly' });

    const buffer = await this.download(info, format);

    return new SongFile(buffer, info.videoDetails.title + '.mp4');
  }

  public async downloadAudo(id: string): Promise<SongFile> {
    const info = await ytdl.getInfo(id, { agent: this.agent });
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });

    const buffer = await this.download(info, format);

    return new SongFile(buffer, info.videoDetails.title + '.mp3');
  }

  private async download(info: ytdl.videoInfo, format: ytdl.videoFormat): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const stream = ytdl(info.videoDetails.video_url, { format: format, agent: this.agent })
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (error: Error) => {
        reject(error);
      });
    })
  }
}
