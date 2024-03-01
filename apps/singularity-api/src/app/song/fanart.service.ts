import { Injectable } from '@nestjs/common';
import { SongFile } from './interfaces/song-file';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class FanartService {

  constructor(private readonly httpService: HttpService) {
  }

  public async getFanartImage(fanartIdOrUrl: string): Promise<SongFile> {
    let url = fanartIdOrUrl;
    const splitUrl = url.split('/');
    const fileName = splitUrl[splitUrl.length - 1];

    if (!this.isUrlNaive(fanartIdOrUrl)) {
      url = 'https://assets.fanart.tv/fanart/' + fanartIdOrUrl;
    }

    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const response$ = this.httpService.get(url, { responseType: 'arraybuffer', maxRedirects: 10 })
      .pipe(map(response => Buffer.from(response.data)));

    const buffer = await lastValueFrom(response$);

    return new SongFile(buffer, fileName);
  }

  // A very naive check, whether the given string is a url or a fanart id.
  private isUrlNaive(idOrUrl: string): boolean {
    return idOrUrl.includes('/');
  }
}
