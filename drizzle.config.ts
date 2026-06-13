import { defineConfig } from "drizzle-kit";

process.loadEnvFile()

function envOrThrow(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`missing ${key}`);
  return val;
}

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db",
  dialect: "postgresql",
  dbCredentials: {
    url: envOrThrow("DB_URL"),
  },
});