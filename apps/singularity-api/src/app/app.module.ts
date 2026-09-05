import { Logger, Module } from '@nestjs/common';
import { SongModule } from './song/song.module';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { environment } from '../environments/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagementModule } from './user-management/user-management.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PartyModule } from './party/party.module';
import { ScheduleModule } from '@nestjs/schedule';
import { importEntitites } from './import-entities';
import { importMigrations } from './import-migrations';
import mysql from 'mysql2';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    ConfigModule.forRoot({
      envFilePath: [
        join(
          __dirname,
          'config',
          environment.production
            ? 'appsettings.env'
            : 'appsettings.development.env'
        ),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        Logger.log(__dirname);

        return {
          type: 'mariadb',
          driver: mysql,
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: importEntitites(),
          migrations: importMigrations(),
          migrationsRun: true,
        }
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    SongModule,
    UserManagementModule,
    PartyModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
