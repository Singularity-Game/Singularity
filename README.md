![singularity-logo.svg](docs%2Fimages%2Fsingularity-logo.svg#gh-dark-mode-only)
![singularity-logo-dark.svg](docs%2Fimages%2Fsingularity-logo-dark.svg#gh-light-mode-only)

<p align="center">
  <img src="https://img.shields.io/github/contributors/Singularity-Game/Singularity?style=flat-square" />
  <img src="https://img.shields.io/github/license/Singularity-Game/Singularity?style=flat-square" />
  <img src="https://img.shields.io/github/actions/workflow/status/Singularity-Game/Singularity/build.yml?style=flat-square" />
</p>
<p align="center">
Introducing Singularity: Your browser's karaoke stage! Gather your friends for a local multiplayer singing experience. No downloads necessary, just pure musical fun in your browser.
</p>




![Screenshot1](/docs/images/screenshot1.png)
![Screenshot3](/docs/images/screenshot3.png)


## ✨ Features ✨
🎉 Play any Song which is available in the **Ultrastar Deluxe File Format**

🎉 Local **Multiplayer**

🎉 **Offline Mode** for slow or metered Internet Connections

🎉 The Game can be installed as a **Progressive Web App**

🎉 **User Management**

## Table of Contents
- [Features](#-features-)
- [Installation](#Installation)
  - [Docker](#docker-)
- [Upload Songs](#upload-songs)
- [Local Development](#getting-started-with-local-development)
  - [Database Migrations](#database-migrations)
- [Credits](#credits)



## Installation
### Docker 🐋
1. Install [Docker](https://www.docker.com/)
2. Create a `docker-compose.yml` File or clone the Repository and use the existing `docker-compose.yml`
    1. When creating your own `docker-compose.yml`, paste in the following contents:
        ```yaml
         services:
           singularity-db:
             image: mariadb:latest
             command: --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-file-per-table=1 --skip-innodb-read-only-compressed
             volumes:
               - singularity-db:/var/lib/mysql
             restart: unless-stopped
             environment:
               TZ: UTC+1
               MYSQL_ROOT_PASSWORD: <MYSQL-ROOT-PASSWORD>
               MYSQL_DATABASE: db
               MYSQL_USER: admin
               MYSQL_PASSWORD: <MYSQL-USER-PASSWORD>
          
           singularity:
             image: ghcr.io/singularity-game/singularity:main
             environment:
               APP_URL: <APP-URL>
               AUTHENTICATION_JWT_SECRET: <JWT-SECRET>
               DB_HOST: singularity-db
               DB_PORT: 3306
               DB_USERNAME: admin
               DB_PASSWORD: <MYSQL-USER-PASSWORD>
               DB_DATABASE: db
               SMTP_SECURE: 'true'
               SMTP_HOST: <SMTP-HOST>
               SMTP_USERNAME: <SMTP-USER>
               SMTP_PASSWORD: <SMTP-PASSWORD>
               SMTP_FROM: <SMTP-FROM>
               SONG_DIRECTORY: songs
             volumes:
              - singularity-songs:/usr/src/app/songs
             ports:
              - 3333:3333
            
       volumes:
         singularity-db:
         singularity-songs:
        ```
   2. Replace the Placeholders `<MYSQL-ROOT-PASSWORD>`, `<MYSQL-USER-PASSWORD>` and `<JWT-SECRET>` with secure Passwords!
   3. Replace the Placeholder `<APP-URL>` with the URL your app will be running on. For example `http://localhost`
   4. Replace the Placeholders `<SMTP-HOST>`, `<SMTP-USER>`, `<SMTP-PASSWORD>` and `<SMTP-FROM>` with the credentials from your SMTP Server. Without an SMTP Server, Singularity will be unable to send emails and you will be unable to create new users.
3. Run the command `docker compose up`
4. Singularity will now be running on `<APP-URL>:3333`. 
5. You can login to Singularity with the Username: `admin` and the Password: `admin`.

## Upload Songs
You need Ultrastar Files to play Singularity. You can download Ultrastar TXT Files, Audio Files, Video Files and Cover Files from the following Song Databases:

- [https://usdb.animux.de/](https://usdb.animux.de/)
- [https://ultrastar-es.org/](https://ultrastar-es.org/en)

You can upload songs to Singularity under **Settings** > **Songs** > **+ New Song**

![Screenshot2](/docs/images/screenshot2.png)

Once Uploaded the Song will be playable!


## Getting Started with local development
1. Prerequisites:
   1. Install NodeJS: https://nodejs.org/
   2. Install Rust: https://rustup.rs/
   3. Install MariaDB: https://mariadb.org/
2. Create a new Database:
   1. On Windows open the `MySQL Client` Software, On Linux run the `mysql` command.
   2. Run the following commands in mysql:
   ```
   create database Singularity;
   grant all privileges on Singularity.* TO 'Singularity'@'%' identified by 'SECURE_PASSWORD';
   flush privileges;
   ```

3. Clone the repository `git clone https://github.com/Singularity-Game/Singularity.git`
4. Create the file `apps/singularity-api/src/config/appsettings.development.env` with the following content:
    ```
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=Singularity
    DB_PASSWORD=SECURE_PASSWORD
    DB_DATABASE=Singularity

    SMTP_SECURE=
    SMTP_HOST=
    SMTP_PORT=
    SMTP_USERNAME=
    SMTP_PASSWORD=
    SMTP_FROM=

    ENABLE_YOUTUBE=true

    APP_URL=http://localhost:4200

    SONG_DIRECTORY=../../../songs

    AUTHENTICATION_JWT_SECRET=RANDOM_STRING_OF_CHARACTERS   
    ```
5. Create the file `ormconfig.ts` in the root directory (next to `package.json`) with the following content:
    ```ts
    import { DataSource } from 'typeorm';
    export const connectionSource = new DataSource({
        migrationsTableName: 'migrations',
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        username: 'Singularity',
        password: 'SECURE_PASSWORD',
        database: 'Singularity',
        logging: false,
        synchronize: false,
        name: 'default',
        entities: ['**/*.entity.ts'],
        migrations: ['apps/api/src/migrations'],
    });
    ```
6. Install Dependencies for Rust:
    ```sh
    rustup install stable
    rustup override set stable
    rustup target add wasm32-unknown-emscripten --toolchain stable
    cargo install wasm-pack
    ```
7. Run `npm install`
8. Run `npm run start`
9. Run `npm run start-api`
10. Open your Browser on `http://localhost:4200`
11. The default credentials are Username: `admin` and Password: `admin`

### Database Migrations
When you add, remove, or modify Entity Models, you must create a database migration. Typeorm can automatically generate Database Migrations with the following command:
```
npm run typeorm migration:generate -- -- ./apps/singularity-api/src/migrations/MIGRATION_NAME
```

### Icons
Icons are taken from https://iconoir.com/ 

## Credits
- This project is heavily inspired by [Performous!](https://github.com/performous/performous)
- This project uses the Pitch Detection library from [Vocalous](https://github.com/vocalous/app) and [pitch detection app!](https://alesgenova.github.io/pitch-detection-app/)
