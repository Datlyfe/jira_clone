import { createConnection, Connection, ConnectionOptions } from "typeorm";

import * as models from "@/models";

const commonConfig: ConnectionOptions = {
  type: "postgres",
  entities: Object.values(models),
  synchronize: true,
};

const connectionOptions: ConnectionOptions =
  process.env.NODE_ENV === "production"
    ? {
        url: process.env.DATABASE_URL,
        ...commonConfig,
        extra: {
          max: 5,
        },
      }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ...commonConfig,
      };

const createDatabaseConnection = (): Promise<Connection> =>
  createConnection(connectionOptions);

export default createDatabaseConnection;
