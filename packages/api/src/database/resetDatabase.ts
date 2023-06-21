import { getConnection } from "typeorm";
import { schedule } from "node-cron";

const resetDatabase = async (): Promise<void> => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.synchronize();
};

export const resetDatabaseJob = () => {
  schedule("0 0 * * *", () => {
    resetDatabase();
  });
};

export default resetDatabase;
