import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/db";
import authRoutes from "./routes/authRoutes";
import educationRoutes from "./routes/educationRoutes";
import licenseRoutes from "./routes/licenseRoutes";
import projectRoutes from "./routes/projectRoutes";
import aboutRoutes from "./routes/aboutRoutes";
import contactRoutes from "./routes/contactRoutes";
import cvRoutes from "./routes/cvRoutes";
import { errorHandler } from "./middleware/errorHandler";
import helmet from "helmet";
import { httpLogger } from "./middleware/httpLogger";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.set("trust proxy", 1);

app.use(helmet());
app.use(httpLogger);
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:4200" }));
// the CV upload is a base64 PDF (up to 5 MB); parsed here so the smaller global limit doesn't apply
app.use("/api/cv", express.json({ limit: "8mb" }));
// profile photo + favicon travel inline as data URLs in PUT /about
app.use(express.json({ limit: "300kb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Portfolio API radi" });
});

// The visitor's own IP (from Cloudflare via nginx, see trust proxy), for the idle easter egg.
// Echoed back to that visitor only, never stored.
app.get("/api/whoami", (req, res) => {
  res.set("Cache-Control", "no-store").json({ ip: req.ip });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const adminCount = await prisma.admin.count();
    res.json({ status: "ok", adminCount });
  } catch (error) {
    res.status(500).json({ status: "error", error: String(error) });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/licenses", licenseRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cv", cvRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});
