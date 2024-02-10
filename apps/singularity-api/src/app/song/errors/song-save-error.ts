import { HttpException, HttpStatus } from '@nestjs/common';

export class SongSaveError extends HttpException {
  constructor() {
    super('SongSaveError', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
