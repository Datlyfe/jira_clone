import { DataSource, DataSourceOptions } from "typeorm";

import * as entities from "@/models";

const commonOptions: DataSourceOptions = {
  type: "postgres",
  entities: Object.values(entities),
  synchronize: true,
};

const AppDataSourceOptions: DataSourceOptions =
  process.env.NODE_ENV === "production"
    ? {
        url: process.env.DATABASE_URL,
        ...commonOptions,
        extra: {
          max: 5,
        },
      }
    : {
        url: process.env.DATABASE_URL,
        ...commonOptions,
      };

const createDatabaseConnection = (): Promise<DataSource> => {
  const AppDataSource = new DataSource(AppDataSourceOptions);
  return AppDataSource.initialize();
};

export default createDatabaseConnection;
