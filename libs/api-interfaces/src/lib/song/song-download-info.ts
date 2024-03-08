export class SongDownloadInfo {
  title!: string;
  artist!: string;

  constructor(title: string, artist: string) {
    this.title = title;
    this.artist = artist;
  }
}
