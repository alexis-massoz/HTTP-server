import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { handlerReadiness } from "./api/readiness.js";
import { middlewareErrorHandling, middlewareLogResponses, middlewareMetrics } from "./api/middlewares.js";
import { handlerMetrics,  } from "./api/metrics.js";
import { handlerChirps, handlerChirpsRetrieve, handlerChirpRetrieve, handlerChirpsDelete } from "./api/chirps.js";
import { handlerReset } from "./api/reset.js";
import { config } from "./api/config.js";
import { handlerUsersCreate, handlerUpdate, handlerPolkaWebhooks } from "./api/users.js";
import { handlerLogin } from "./api/auth.js";
import { handlerRefresh } from "./api/refresh.js";
import { handlerRevoke } from "./api/revoke.js";


const migrationClient = postgres(config.db.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetrics, express.static("./src/app"));


app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirpsRetrieve(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerChirpRetrieve(req, res)).catch(next);
});



app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});

app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirps(req, res)).catch(next);
});

app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerUsersCreate(req, res)).catch(next);
});

app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});

app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefresh(req, res)).catch(next);
});

app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handlerRevoke(req, res)).catch(next);
});

app.post("/api/polka/webhooks", (req, res, next) => {
  Promise.resolve(handlerPolkaWebhooks(req, res)).catch(next);
});

app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUpdate(req, res)).catch(next);
});



app.delete("/api/chirps/:chirpId", (req, res, next) => {   
  Promise.resolve(handlerChirpsDelete(req, res)).catch(next); 
});

app.use(middlewareErrorHandling);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});

