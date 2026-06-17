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
};

export type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
}

export type AppConfig = {
  api: APIConfig;
  db: DBConfig;
}

export const config: AppConfig = { 
  api: {
    fileserverHits: 0,
    port: Number(envOrThrow("PORT")),
    platform: envOrThrow("PLATFORM"),
  },
  db: {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
}

