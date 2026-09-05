const {join} = require("path");
module.exports = {
  externals: [
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
  externalsType: "commonjs",
  output: {
    path: join(__dirname, '../../dist/apps/singularity-api'),
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    alias: {
      mysql2: require.resolve("mysql2"),
    },
    tsconfig: {
      configFile: join(__dirname, '..', '..', 'tsconfig.base.json'),
      references: "auto"
    },
    extensions: ['.ts', '.js', '.json']
  }
};
