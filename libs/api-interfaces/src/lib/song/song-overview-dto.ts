import { AutoMap } from '@automapper/classes';

export class SongOverviewDto {
  @AutoMap()
  public id!: number;

  @AutoMap()
  public name!: string;

  @AutoMap()
  public artist!: string;

  @AutoMap()
  public year!: number;
}
