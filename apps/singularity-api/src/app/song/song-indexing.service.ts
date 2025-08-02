import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './models/song.entity';
import { SongNote } from './models/song-note.entity';
import { SongNoteType } from '@singularity/api-interfaces';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SongIndexingService implements OnModuleInit {
  private readonly logger = new Logger(SongIndexingService.name);
  private isIndexing = false;

  constructor(
    @InjectRepository(Song) private readonly songRepository: Repository<Song>,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    // Auto-index on startup if enabled
    if (this.configService.get('ENABLE_AUTO_INDEXING', 'false') === 'true') {
      this.logger.log('Auto-indexing enabled, starting background scan...');
      // Run after a short delay to ensure the database is ready
      setTimeout(() => this.indexSongs(), 5000);
    }
  }

  /**
   * Scans the song directory for Ultrastar .txt files and indexes them
   */
  async indexSongs(): Promise<{ indexed: number; skipped: number; errors: number }> {
    if (this.isIndexing) {
      this.logger.warn('Indexing already in progress, skipping...');
      return { indexed: 0, skipped: 0, errors: 0 };
    }

    this.isIndexing = true;
    const stats = { indexed: 0, skipped: 0, errors: 0 };

    try {
      const baseDirectory = this.getSongDirectoryPath();
      this.logger.log(`Starting song indexing in directory: ${baseDirectory}`);

      if (!fs.existsSync(baseDirectory)) {
        this.logger.warn(`Song directory does not exist: ${baseDirectory}`);
        return stats;
      }

      const txtFiles = await this.findUltrastarFiles(baseDirectory);
      this.logger.log(`Found ${txtFiles.length} .txt files to process`);

      for (const txtFile of txtFiles) {
        try {
          const result = await this.indexSingleSong(txtFile);
          if (result) {
            stats.indexed++;
            this.logger.log(`Indexed: ${result.artist} - ${result.name}`);
          } else {
            stats.skipped++;
          }
        } catch (error) {
          stats.errors++;
          this.logger.error(`Failed to index ${txtFile}: ${error.message}`);
        }
      }

      this.logger.log(`Indexing complete. Indexed: ${stats.indexed}, Skipped: ${stats.skipped}, Errors: ${stats.errors}`);
    } catch (error) {
      this.logger.error(`Indexing failed: ${error.message}`);
    } finally {
      this.isIndexing = false;
    }

    return stats;
  }

  /**
   * Recursively finds all .txt files in the song directory
   */
  private async findUltrastarFiles(dir: string): Promise<string[]> {
    const txtFiles: string[] = [];

    const scan = async (currentDir: string) => {
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);

          if (entry.isDirectory()) {
            await scan(fullPath);
          } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.txt')) {
            // Check if this looks like an Ultrastar file by reading the first few lines
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (this.isUltrastarFile(content)) {
                txtFiles.push(fullPath);
              }
            } catch (error) {
              this.logger.warn(`Could not read file ${fullPath}: ${error.message}`);
            }
          }
        }
      } catch (error) {
        this.logger.warn(`Could not scan directory ${currentDir}: ${error.message}`);
      }
    };

    await scan(dir);
    return txtFiles;
  }

  /**
   * Checks if a text file is an Ultrastar file by looking for characteristic metadata
   */
  private isUltrastarFile(content: string): boolean {
    const lines = content.split('\n').slice(0, 20); // Check first 20 lines
    return lines.some(line => 
      line.startsWith('#TITLE:') || 
      line.startsWith('#ARTIST:') || 
      line.startsWith('#BPM:')
    );
  }

  /**
   * Indexes a single song from its .txt file
   */
  private async indexSingleSong(txtFilePath: string): Promise<Song | null> {
    const content = fs.readFileSync(txtFilePath, 'utf8');
    const songDir = path.dirname(txtFilePath);

    // Extract metadata
    const artist = this.getSongMetadata(content, '#ARTIST');
    const title = this.getSongMetadata(content, '#TITLE');
    const year = +this.getSongMetadata(content, '#YEAR') || 0;
    const bpm = +(this.getSongMetadata(content, '#BPM').replace(',', '.')) || 120;
    const gap = +this.getSongMetadata(content, '#GAP') || 0;
    const start = +this.getSongMetadata(content, '#START') || 0;
    const end = +this.getSongMetadata(content, '#END') || 0;

    if (!artist || !title) {
      this.logger.warn(`Missing artist or title in ${txtFilePath}`);
      return null;
    }

    // Check if song already exists
    const existingSong = await this.songRepository.findOne({
      where: { artist, name: title }
    });

    if (existingSong) {
      this.logger.debug(`Song already exists: ${artist} - ${title}`);
      return null;
    }

    // Find associated media files
    const mediaFiles = this.findMediaFiles(songDir, txtFilePath);

    if (!mediaFiles.audio) {
      this.logger.warn(`No audio file found for ${artist} - ${title} in ${songDir}`);
      return null;
    }

    // Create song entity
    const songNotes = this.getSongNotes(content);
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
    
    // Store relative paths from the song directory
    const baseSongDir = this.getSongDirectoryPath();
    song.audioFileName = path.relative(baseSongDir, mediaFiles.audio);
    song.videoFileName = mediaFiles.video ? path.relative(baseSongDir, mediaFiles.video) : '';
    song.coverFileName = mediaFiles.cover ? path.relative(baseSongDir, mediaFiles.cover) : '';

    return this.songRepository.save(song);
  }

  /**
   * Finds associated media files (audio, video, cover) for a song
   */
  private findMediaFiles(songDir: string, txtFilePath: string): {
    audio?: string;
    video?: string;
    cover?: string;
  } {
    const txtBasename = path.basename(txtFilePath, '.txt');
    const files = fs.readdirSync(songDir);
    const result: { audio?: string; video?: string; cover?: string } = {};

    // Check for files referenced in the .txt file first
    const txtContent = fs.readFileSync(txtFilePath, 'utf8');
    const audioRef = this.getSongMetadata(txtContent, '#MP3');
    const videoRef = this.getSongMetadata(txtContent, '#VIDEO');
    const coverRef = this.getSongMetadata(txtContent, '#COVER');

    // Look for referenced files
    if (audioRef) {
      const audioPath = path.join(songDir, audioRef);
      if (fs.existsSync(audioPath)) {
        result.audio = audioPath;
      }
    }
    if (videoRef) {
      const videoPath = path.join(songDir, videoRef);
      if (fs.existsSync(videoPath)) {
        result.video = videoPath;
      }
    }
    if (coverRef) {
      const coverPath = path.join(songDir, coverRef);
      if (fs.existsSync(coverPath)) {
        result.cover = coverPath;
      }
    }

    // If not found via references, look for files with matching basename or common patterns
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.mov', '.wmv'];
    const coverExtensions = ['.jpg', '.jpeg', '.png', '.bmp'];

    for (const file of files) {
      const filePath = path.join(songDir, file);
      const fileBasename = path.basename(file, path.extname(file));
      const ext = path.extname(file).toLowerCase();

      // Audio files
      if (!result.audio && audioExtensions.includes(ext)) {
        if (fileBasename.toLowerCase() === txtBasename.toLowerCase() || 
            file.toLowerCase().includes('audio') ||
            audioExtensions.includes(ext)) {
          result.audio = filePath;
        }
      }

      // Video files
      if (!result.video && videoExtensions.includes(ext)) {
        if (fileBasename.toLowerCase() === txtBasename.toLowerCase() || 
            file.toLowerCase().includes('video') ||
            videoExtensions.includes(ext)) {
          result.video = filePath;
        }
      }

      // Cover files
      if (!result.cover && coverExtensions.includes(ext)) {
        if (fileBasename.toLowerCase() === txtBasename.toLowerCase() || 
            file.toLowerCase().includes('cover') ||
            file.toLowerCase().includes('background') ||
            coverExtensions.includes(ext)) {
          result.cover = filePath;
        }
      }
    }

    return result;
  }

  /**
   * Gets the absolute path to the song directory
   */
  private getSongDirectoryPath(): string {
    const baseDirectory = this.configService.get('SONG_DIRECTORY', 'songs');
    return path.resolve(process.cwd(), baseDirectory);
  }

  /**
   * Extracts metadata from Ultrastar .txt content
   */
  private getSongMetadata(txt: string, metaDataKey: string): string {
    const lines = txt.split('\n');
    const metaDataLine = lines.find((line: string) => line.startsWith(metaDataKey));
    if (!metaDataLine) return '';
    
    const metaDatas = metaDataLine.split(':');
    return metaDatas.slice(1).join(':').trim();
  }

  /**
   * Parses song notes from Ultrastar .txt content
   */
  private getSongNotes(txt: string): SongNote[] {
    const lines = txt.split('\n');
    return lines
      .filter((line: string) => !line.startsWith('#') && line.trim().length > 0)
      .map((line: string) => this.getSongNote(line))
      .filter((songNote: SongNote | null) => songNote !== null);
  }

  /**
   * Parses a single note line
   */
  private getSongNote(line: string): SongNote | null {
    const songNote = new SongNote();
    const lineArray = line.trim().split(' ');

    if (lineArray.length < 2) return null;

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
        return null;
    }

    songNote.startBeat = +lineArray[1] || 0;
    songNote.lengthInBeats = +lineArray[2] || 0;
    songNote.pitch = +lineArray[3] || 0;
    songNote.text = lineArray.slice(4).join(' ').replace(/\r?\n/g, '').trim();

    return songNote;
  }

  /**
   * Calculates points per beat for scoring
   */
  private getPointsPerBeat(songNotes: SongNote[]): number {
    const songNotesWithoutLinebreaks = songNotes.filter(
      (songNote: SongNote) => songNote.type !== SongNoteType.LineBreak
    );
    const beatCount = songNotesWithoutLinebreaks.reduce(
      (previous: number, current: SongNote) =>
        previous + current.lengthInBeats * (current.type === SongNoteType.Golden ? 2 : 1),
      0
    );

    return beatCount > 0 ? 10000 / beatCount : 100;
  }

  /**
   * Returns current indexing status
   */
  getIndexingStatus(): { isIndexing: boolean } {
    return { isIndexing: this.isIndexing };
  }
}