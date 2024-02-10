export function getSongDirectory(req: Request, file: Express.Multer.File, callback: (error: Error, directory: string) => void): void {
  callback(null, file.originalname);
}
