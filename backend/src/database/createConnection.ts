import { createConnection, Connection, ConnectionOptions } from "typeorm";

import * as models from "@/models";

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: Object.values(models),
  synchronize: true
};

const createDatabaseConnection = (): Promise<Connection> =>
  createConnection(connectionOptions);

export default createDatabaseConnection;
