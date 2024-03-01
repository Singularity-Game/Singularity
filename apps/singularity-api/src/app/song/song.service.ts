import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { SongNote } from './models/song-note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './models/song.entity';
import { Repository } from 'typeorm';
import { SongNoteType, SongUploadInfo } from '@singularity/api-interfaces';
import { ConfigService } from '@nestjs/config';
import { SongAlreadyExistsError } from './errors/song-already-exists-error';
import { SongSaveError } from './errors/song-save-error';
import { YtService } from './yt.service';
import { SongFile } from './interfaces/song-file';

@Injectable()
export class SongService {

  constructor(@InjectRepository(Song) private readonly songRepository: Repository<Song>,
              private readonly configService: ConfigService,
              private readonly ytService: YtService) {
  }

  public async getAllSongs(withNotes = false): Promise<Song[]> {
    return this.songRepository.find({ relations: { notes: withNotes } });
  }

  public async getSongById(id: number, withNotes = false): Promise<Song> {
    return this.songRepository.findOneOrFail({ where: { id: id }, relations: { notes: withNotes } })
  }

  public async getSongAudioFile(id: number): Promise<Buffer> {
    const song = await this.getSongById(id);

    return this.getSongDirectory(song.artist, song.name)
      .then((directory: string) => new Promise<Buffer>((resolve, reject) => {
        fs.readFile(`${directory}/${song.audioFileName}`, (error: Error, data: Buffer) => {
          if (error) {
            reject(error);
          }

          resolve(data);
        });
    }));
  }

  public async getSongVideoFile(id: number): Promise<Buffer> {
    const song = await this.getSongById(id);

    return this.getSongDirectory(song.artist, song.name)
      .then((directory: string) => new Promise<Buffer>((resolve, reject) => {
        fs.readFile(`${directory}/${song.videoFileName}`, (error: Error, data: Buffer) => {
          if (error) {
            reject(error);
          }

          resolve(data);
        });
      }));
  }

  public async getSongCoverFile(id: number): Promise<Buffer> {
    const song = await this.getSongById(id);

    return this.getSongDirectory(song.artist, song.name)
      .then((directory: string) => new Promise<Buffer>((resolve, reject) => {
        fs.readFile(`${directory}/${song.coverFileName}`, (error: Error, data: Buffer) => {
          if (error) {
            reject(error);
          }

          resolve(data);
        });
      }));
  }

  public async deleteSong(id: number): Promise<Song> {
    const song = await this.getSongById(id);
    const directory = await this.getSongDirectory(song.artist, song.name);

    await this.songRepository.delete(song.id);

    fs.rmSync(`${directory}/${song.coverFileName}`);
    fs.rmSync(`${directory}/${song.audioFileName}`);
    fs.rmSync(`${directory}/${song.videoFileName}`);
    fs.rmdirSync(await this.getSongDirectory(song.artist, song.name));

    return song;
  }

  public async getUploadInfo(txtFile: SongFile): Promise<SongUploadInfo> {
    const songText = txtFile.buffer.toString('utf8');
    const videoMetaData = this.getSongMetadata(songText, '#VIDEO');
    const songInfo = new SongUploadInfo();

    const videoDownloadId = this.getVideoDownloadId(videoMetaData);

    if (videoDownloadId !== '') {
      songInfo.isVideoDownloadable = true;
      songInfo.videoInfo = await this.ytService.getInfo(videoDownloadId);
    }

    return songInfo;
  }

  public async createSongFromYt(txtFile: SongFile): Promise<Song> {
    const songText = txtFile.buffer.toString('utf8');
    const videoMetaData = this.getSongMetadata(songText, '#VIDEO');
    const videoDownloadId = this.getVideoDownloadId(videoMetaData);

    const [video, audio]: [SongFile, SongFile] = await Promise.all([
      this.ytService.downloadVideo(videoDownloadId),
      this.ytService.downloadAudo(videoDownloadId)
    ])

    const coverFile = new SongFile(Buffer.of(), 'placerholder.png');

    return this.createSong(txtFile, audio, video, coverFile);
  }

  public async createSong(txtFile: SongFile,
                          audioFile: SongFile,
                          videoFile: SongFile,
                          coverFile: SongFile,
                          songStart?: number,
                          songEnd?: number): Promise<Song> {
    const songText = txtFile.buffer.toString('utf8');


    const artist = this.getSongMetadata(songText, '#ARTIST');
    const title = this.getSongMetadata(songText, '#TITLE');
    const year = +this.getSongMetadata(songText, '#YEAR') ?? 0;
    const bpm = +(this.getSongMetadata(songText, '#BPM').replace(',', '.'));
    const gap = +this.getSongMetadata(songText, '#GAP') ?? 0;
    const start = songStart ?? +this.getSongMetadata(songText, '#START') ?? 0;
    const end = songEnd ?? +this.getSongMetadata(songText, '#END') ?? 0;

    if (await this.songRepository.exist({
      where: {
        artist: artist,
        name: title
      }
    })) {
      throw new SongAlreadyExistsError();
    }

    try {
      const directory = await this.createSongDirectory(artist, title);
      this.writeFile(directory, `${artist} - ${title}.${this.getFileType(audioFile)}`, audioFile.buffer);
      this.writeFile(directory, `${artist} - ${title}.${this.getFileType(videoFile)}`, videoFile.buffer);
      this.writeFile(directory, `${artist} - ${title}.${this.getFileType(coverFile)}`, coverFile.buffer);

      const songNotes = this.getSongNotes(songText);
      const song = this.songRepository.create();
      song.artist = artist;
      song.name = title;
      song.year = year;
      song.bpm = bpm;
      song.gap = gap;
      song.start = start;
      song.end = end;
      song.notes = songNotes;
      song.pointsPerBeat = this.getPointsPerBeat(songNotes);
      song.audioFileName = `${artist} - ${title}.${this.getFileType(audioFile)}`;
      song.videoFileName = `${artist} - ${title}.${this.getFileType(videoFile)}`;
      song.coverFileName = `${artist} - ${title}.${this.getFileType(coverFile)}`;

      return this.songRepository.save(song);
    } catch (e) {
      Logger.error(e);
      throw new SongSaveError();
    }

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

  private getSongNotes(txt: string): SongNote[] {
    const lines = txt.split('\n');
    return lines
      .filter((line: string) => !line.startsWith('#'))
      .map((line: string) => this.getSongNote(line))
      .filter((songNote: SongNote | null) => songNote !== null);
  }

  private getSongNote(line: string): SongNote | null {
    const songNote = new SongNote();

    const lineArray = line.split(' ');

    switch (lineArray[0]) {
      case ':':
        songNote.type = SongNoteType.Regular;
        break;
      case '*':
        songNote.type = SongNoteType.Golden;
        break;
      case 'F':
        songNote.type = SongNoteType.Freestyle;
        break;
      case '-':
        songNote.type = SongNoteType.LineBreak;
        break;
      case 'E':
        return null;
      default:
        throw new Error('Reached unexpected SongNoteType: ' + lineArray[0]);
    }

    songNote.startBeat = +lineArray[1] || 0;
    songNote.lengthInBeats = +lineArray[2] || 0;
    songNote.pitch = +lineArray[3] || 0;
    songNote.text = lineArray.slice(4).join(' ').replace('\r', '').replace('\n', '');

    return songNote;
  }

  private getPointsPerBeat(songNotes: SongNote[]): number {
    const songNotesWithoutLinebreaks = songNotes.filter((songNote: SongNote) => songNote.type !== SongNoteType.LineBreak);
    const beatCount = songNotesWithoutLinebreaks.reduce((previous: number, current: SongNote) =>
      previous + current.lengthInBeats * (current.type === SongNoteType.Golden ? 2 : 1), // Golden Notes give us double points
      0);

    return 10000 / beatCount;
  }

  private writeFile(path: string, fileName: string, buffer: Buffer | string): void {
    const stream = fs.createWriteStream(`${path}/${fileName}`);
    stream.write(buffer);
    stream.end();
  }

  private getFileType(file: SongFile): string {
    const array = file.originalName.split('.');
    return array[array.length - 1];
  }

  private async createSongDirectory(artist: string, title: string): Promise<string> {
    const baseDirectory = this.configService.get('SONG_DIRECTORY');

    return new Promise<string>((resolve: (directory: string) => void, reject: (error: Error) => void) => {
      const dirName = `${__dirname}/${baseDirectory}/${artist} - ${title}`;
      fs.stat(dirName, (statError: Error) => {
        if (statError) {
          fs.mkdir(dirName, (mkDirError: Error) => {
            if (mkDirError) {
              reject(mkDirError);
              return;
            }
            resolve(dirName);
          });
        } else {
          resolve(dirName)
        }
      });
    });
  }

  private async getSongDirectory(artist: string, title: string): Promise<string> {
    const baseDirectory = this.configService.get('SONG_DIRECTORY');

    return new Promise<string>((resolve: (directory: string) => void, reject: (error: Error) => void) => {
      const dirName = `${__dirname}/${baseDirectory}/${artist} - ${title}`;
      fs.stat(dirName, (statError: Error) => {
        if (statError) {
          reject(statError);
        } else {
          resolve(dirName)
        }
      });
    });
  }
}
