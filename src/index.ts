import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetrics } from "./api/middlewares.js";
import { handlerRequests, handlerReset } from "./api/handlers.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetrics);
app.use("/app", express.static("./src/app"));

app.get("/reset", handlerReset);
app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerRequests);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

