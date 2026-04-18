import cors from "cors";
import express from "express";
import { env } from "./config.js";
import { createPaymentGuard } from "./payment.js";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const guard = await createPaymentGuard();
registerRoutes(app, guard);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "internal error" });
});

const host = process.env.HOST || (process.env.RENDER ? "0.0.0.0" : "127.0.0.1");
app.listen(env.port, host, () => {
  console.log(`API listening on http://${host}:${env.port} using ${guard.mode}`);
});
