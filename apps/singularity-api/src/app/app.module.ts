import { Logger, Module } from '@nestjs/common';
import { SongModule } from './song/song.module';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { environment } from '../environments/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { importEntitites } from './import-entities';
import { importMigrations } from './import-migrations';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { UserManagementModule } from './user-management/user-management.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PartyModule } from './party/party.module';

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
    AutomapperModule.forRoot({
      strategyInitializer: classes()
    }),
    SongModule,
    UserManagementModule,
    PartyModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
