import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './models/song.entity';
import { UltrastarParser } from './utils/ultrastar-parser';
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
              if (UltrastarParser.isUltrastarFile(content)) {
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
   * Indexes a single song from its .txt file
   */
  private async indexSingleSong(txtFilePath: string): Promise<Song | null> {
    const content = fs.readFileSync(txtFilePath, 'utf8');
    const songDir = path.dirname(txtFilePath);

    // Parse the Ultrastar file
    const { metadata, notes, pointsPerBeat } = UltrastarParser.parse(content);
    
    const artist = metadata.artist;
    const title = metadata.title;

    if (!metadata.artist || !metadata.title) {
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
    const song = this.songRepository.create();
    song.artist = metadata.artist;
    song.name = metadata.title;
    song.year = metadata.year;
    song.bpm = metadata.bpm;
    song.gap = metadata.gap;
    song.start = metadata.start;
    song.end = metadata.end;
    song.notes = notes;
    song.pointsPerBeat = pointsPerBeat;
    
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
    const audioRef = UltrastarParser.getMetadataValue(txtContent, '#MP3');
    const videoRef = UltrastarParser.getMetadataValue(txtContent, '#VIDEO');
    const coverRef = UltrastarParser.getMetadataValue(txtContent, '#COVER');

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
   * Returns current indexing status
   */
  getIndexingStatus(): { isIndexing: boolean } {
    return { isIndexing: this.isIndexing };
  }
}