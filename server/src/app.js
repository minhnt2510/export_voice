const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const ttsRoutes = require("./routes/tts.routes");
const creditRoutes = require("./routes/credit.routes");
const apiKeyRoutes = require("./routes/apiKey.routes");
const publicRoutes = require("./routes/public.routes");

const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174"
];

const normalizeOrigin = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\/+$/, "");
};

const parseOrigins = (...values) => {
  return values
    .flatMap((value) => (value || "").split(","))
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);
};

const buildWildcardMatchers = (patterns) => {
  return patterns
    .map((pattern) => {
      if (!pattern.includes("*")) {
        return null;
      }

      const escapedPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
      return new RegExp(`^${escapedPattern}$`, "i");
    })
    .filter(Boolean);
};

const configuredOrigins = parseOrigins(process.env.CLIENT_URL, process.env.CLIENT_URLS);
const explicitOrigins = new Set(
  [...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins].map((origin) => normalizeOrigin(origin))
);

const wildcardMatchers = buildWildcardMatchers([
  ...parseOrigins(process.env.CLIENT_URL_PATTERNS),
  ...configuredOrigins.filter((origin) => origin.includes("*"))
]);

const isOriginAllowed = (origin) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  if (explicitOrigins.has(normalizedOrigin)) {
    return true;
  }

  return wildcardMatchers.some((regex) => regex.test(normalizedOrigin));
};

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tts", ttsRoutes);
app.use("/api/credits", creditRoutes);
app.use("/api/api-keys", apiKeyRoutes);
app.use("/api/public", publicRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
