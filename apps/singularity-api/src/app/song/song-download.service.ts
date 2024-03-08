import { Injectable } from '@nestjs/common';
import { SongDownloadInfo, SongUploadInfo } from '@singularity/api-interfaces';
import { ConfigService } from '@nestjs/config';
import { YtService } from './yt.service';
import { SongFile } from './interfaces/song-file';
import { FanartService } from './fanart.service';
import { SongService } from './song.service';

@Injectable()
export class SongDownloadService {

  private downloadingSongs: SongDownloadInfo[] = [];

  constructor(private readonly songService: SongService,
              private readonly configService: ConfigService,
              private readonly ytService: YtService,
              private readonly fanartService: FanartService) {
  }

  public async getUploadInfo(txtFile: SongFile): Promise<SongUploadInfo> {
    if(this.configService.get('ENABLE_YOUTUBE') !== 'true') {
      return new SongUploadInfo()
    }

    const songText = txtFile.buffer.toString('utf8');
    const videoMetaData = this.getSongMetadata(songText, '#VIDEO');
    const songInfo = new SongUploadInfo();
    const videoDownloadId = this.getVideoDownloadId(videoMetaData);
    const coverDownloadId = this.getFanartIdOrUrl(videoMetaData);

    if (videoDownloadId !== '' && coverDownloadId !== '') {
      songInfo.isVideoDownloadable = true;
      songInfo.videoInfo = await this.ytService.getInfo(videoDownloadId);
    }

    return songInfo;
  }

  public async createSongFromYt(txtFile: SongFile): Promise<void> {
    if(this.configService.get('ENABLE_YOUTUBE') !== 'true') {
      return;
    }

    const songText = txtFile.buffer.toString('utf8');
    const videoMetaData = this.getSongMetadata(songText, '#VIDEO');
    const videoDownloadId = this.getVideoDownloadId(videoMetaData);
    const fanartDownloadId = this.getFanartIdOrUrl(videoMetaData);

    const downloadInfo = new SongDownloadInfo(
      this.getSongMetadata(songText, '#TITLE'),
      this.getSongMetadata(songText, '#ARTIST')
    );
    this.downloadingSongs.push(downloadInfo);

    const [video, audio, cover]: [SongFile, SongFile, SongFile] = await Promise.all([
      this.ytService.downloadVideo(videoDownloadId),
      this.ytService.downloadAudo(videoDownloadId),
      this.fanartService.getFanartImage(fanartDownloadId)
    ]);

    try {
      await this.songService.createSong(txtFile, audio, video, cover);
    } catch {
      // Do nothing, the user can try again downloading the song.
    }


    const index = this.downloadingSongs.indexOf(downloadInfo);

    if (index !== -1) {
      this.downloadingSongs.splice(index);
    }
  }

  public getDownloadingSongs(): SongDownloadInfo[] {
    return this.downloadingSongs;
  }

  private getSongMetadata(txt: string, metaDataKey: string): string {
    const lines = txt.split('\n');
    const metaDataLine = lines.find((line: string) => line.startsWith(metaDataKey));
    const metaDatas = metaDataLine?.split(':') ?? [];
    return metaDatas.slice(1).join(':').trim();
  }

  private getVideoDownloadId(videoMeta: string): string {
    const metaDatas = videoMeta.split(',')
    return metaDatas.find((metaData: string) => metaData.startsWith('v='))?.replace('v=', '') ?? '';
  }

  private getFanartIdOrUrl(videoMeta: string): string {
    const metaDatas = videoMeta.split(',')
    return metaDatas.find((metaData: string) => metaData.startsWith('co='))?.replace('co=', '') ?? '';
  }
}
