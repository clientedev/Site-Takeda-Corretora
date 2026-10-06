import express, { type Express, type Request, type Response, type NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
// Root and API Health checks
app.get(["/healthz", "/health"], (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API endpoints
app.use("/api", router);

// Static frontend serving for single-service Railway deployment
const candidateStaticPaths = [
  path.resolve(process.cwd(), "artifacts/takeda-corretora/dist/public"),
  path.resolve(__dirname, "../../takeda-corretora/dist/public"),
  path.resolve(process.cwd(), "dist/public"),
  path.resolve(__dirname, "../public"),
];

const staticDir = candidateStaticPaths.find((p) => fs.existsSync(p));

if (staticDir) {
  logger.info({ staticDir }, "Serving static frontend files from directory");
  app.use(express.static(staticDir, { maxAge: "1d" }));

  // Fallback to index.html for SPA client-side routing (Express 5 compatible)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      return next();
    }
    const indexPath = path.join(staticDir, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
} else {
  logger.warn("No static frontend build found. Running in API-only mode.");
}

export default app;
