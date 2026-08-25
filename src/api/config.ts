import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile()

function envOrThrow(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`missing ${key}`);
  return val;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export type APIConfig = {
  fileserverHits: number;
  port: number;
  platform: string;
  polkaKey: string;
};

export type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
}

export type JwtConfig = {
  secret: string;
};

export type AppConfig = {
  api: APIConfig;
  db: DBConfig;
  jwt: JwtConfig;
}

export const config: AppConfig = { 
  api: {
    fileserverHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
    polkaKey: envOrThrow("POLKA_KEY"),
  },
  db: {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
  jwt: {
    secret: envOrThrow("SECRET"),
  },
};

