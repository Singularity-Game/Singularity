import { HttpException, HttpStatus } from '@nestjs/common';

export class SongAlreadyExistsError extends HttpException {
  constructor() {
    super('SongAlreadyExists', HttpStatus.BAD_REQUEST);
  }
}
