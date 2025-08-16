import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './models/song.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SongAlreadyExistsError } from './errors/song-already-exists-error';
import { SongSaveError } from './errors/song-save-error';
import { SongFile } from './interfaces/song-file';
import { UltrastarParser } from './utils/ultrastar-parser';

@Injectable()
export class SongService {

  constructor(@InjectRepository(Song) private readonly songRepository: Repository<Song>,
              private readonly configService: ConfigService) {
  }

  public async getAllSongs(withNotes = false): Promise<Song[]> {
    return this.songRepository.find({ relations: { notes: withNotes } });
  }

  public async getSongById(id: number, withNotes = false): Promise<Song> {
    return this.songRepository.findOneOrFail({ where: { id: id }, relations: { notes: withNotes } })
  }

  public async getSongAudioFile(id: number): Promise<Buffer> {
    const song = await this.getSongById(id);

    // Handle both old format (filename only) and new format (relative path)
    const audioPath = song.audioFileName.includes('/') 
      ? this.getAbsoluteSongPath(song.audioFileName)
      : await this.getSongDirectory(song.artist, song.name).then(dir => `${dir}/${song.audioFileName}`);

    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(audioPath, (error: Error, data: Buffer) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }

  public async getSongVideoFile(id: number): Promise<Buffer> {
    const song = await this.getSongById(id);

    // Handle both old format (filename only) and new format (relative path)
    const videoPath = song.videoFileName.includes('/') 
      ? this.getAbsoluteSongPath(song.videoFileName)
      : await this.getSongDirectory(song.artist, song.name).then(dir => `${dir}/${song.videoFileName}`);

    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(videoPath, (error: Error, data: Buffer) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  }

  public async getSongCoverFile(id: number): Promise<Buffer> {
    const song = await this.getSongById(id);

    // Handle both old format (filename only) and new format (relative path)
    const coverPath = song.coverFileName.includes('/') 
      ? this.getAbsoluteSongPath(song.coverFileName)
      : await this.getSongDirectory(song.artist, song.name).then(dir => `${dir}/${song.coverFileName}`);

    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(coverPath, (error: Error, data: Buffer) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
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

  public async createSong(txtFile: SongFile,
                          audioFile: SongFile,
                          videoFile: SongFile,
                          coverFile: SongFile,
                          songStart?: number,
                          songEnd?: number): Promise<Song> {
    const songText = txtFile.buffer.toString('utf8');
    const { metadata, notes, pointsPerBeat } = UltrastarParser.parse(songText);

    const artist = metadata.artist;
    const title = metadata.title;
    const year = metadata.year;
    const bpm = metadata.bpm;
    const gap = metadata.gap;
    const start = songStart ?? metadata.start;
    const end = songEnd ?? metadata.end;

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

      const song = this.songRepository.create();
      song.artist = artist;
      song.name = title;
      song.year = year;
      song.bpm = bpm;
      song.gap = gap;
      song.start = start;
      song.end = end;
      song.notes = notes;
      song.pointsPerBeat = pointsPerBeat;
      song.audioFileName = `${artist} - ${title}.${this.getFileType(audioFile)}`;
      song.videoFileName = `${artist} - ${title}.${this.getFileType(videoFile)}`;
      song.coverFileName = `${artist} - ${title}.${this.getFileType(coverFile)}`;

      return this.songRepository.save(song);
    } catch (e) {
      Logger.error(e);
      throw new SongSaveError();
    }

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

  private getAbsoluteSongPath(relativePath: string): string {
    const baseDirectory = this.configService.get('SONG_DIRECTORY', 'songs');
    return path.resolve(process.cwd(), baseDirectory, relativePath);
  }
}
