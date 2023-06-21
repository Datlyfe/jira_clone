declare namespace NodeJS {
  export interface ProcessEnv {
    DB_HOST: string;
    DB_PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    DB_TEST_DATABASE: string;
    JWT_SECRET: string;
    NODE_ENV: string;
    SENTRY_DSN: string;
  }
}
