process.loadEnvFile()

function envOrThrow(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`missing ${key}`);
  return val;
}

export type APIConfig = {
  fileserverHits: number;
  dbURL: string;
};

export const config: APIConfig = { fileserverHits: 0, dbURL: envOrThrow("DB_URL") };

