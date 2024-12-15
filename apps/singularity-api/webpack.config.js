
const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/singularity-api'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets", "./src/config"],
      optimization: false,
      outputHashing: 'none',
      externalDependencies: [
        "react-native-sqlite-storage",
        "@google-cloud/spanner",
        "mongodb",
        "@sap/hana-client",
        "hdb-pool",
        "mysql",
        "oracledb",
        "pg",
        "pg-native",
        "pg-query-stream",
        "typeorm-aurora-data-api-driver",
        "redis",
        "ioredis",
        "better-sqlite3",
        "sqlite3",
        "sql.js",
        "mssql",
        "react-native-sqlite-storage",
        "cache-manager",
        "class-validator",
        "class-transformer",
        "@nestjs/websockets/socket-module",
        "@nestjs/microservices/microservices-module",
        "@nestjs/microservices",
        "sharp"
      ],
      generatePackageJson: true
    })
  ],
};

