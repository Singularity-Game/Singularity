export class SongFile {
  public static fromMulterFile(file: Express.Multer.File): SongFile {
    return new SongFile(file.buffer, file.originalname);
  }

  public readonly buffer: Buffer;
  public readonly originalName: string;

  constructor(buffer: Buffer, originalName: string) {
    this.buffer = buffer;
    this.originalName = originalName;
  }


}
