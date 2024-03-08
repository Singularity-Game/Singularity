export class SongListDownloadInfo {
  title: string;
  artist: string;
  state: SongListDownloadState;

  constructor(title: string, artist: string, state: SongListDownloadState) {
    this.title = title;
    this.artist = artist;
    this.state = state;
  }
}

export enum SongListDownloadState {
  loading = 0,
  finished = 1
}
