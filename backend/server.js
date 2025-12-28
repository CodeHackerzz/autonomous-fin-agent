import express from "express";
import cors from "cors";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../frontend/sample_data");
let latestSignal = {
  type: "idle",
  message: "Waiting for live data...",
  severity: "low"
};
const watcher = chokidar.watch(DATA_DIR, {
  persistent: true,
  ignoreInitial: true
});

watcher.on("add", handleFile);
watcher.on("change", handleFile);

function handleFile(filePath) {
  const name = path.basename(filePath).toLowerCase();

  if (name.includes("earnings")) {
    latestSignal = {
      type: "earnings",
      severity: "medium",
      message: "Operating margin compression detected"
    };
  } 
  else if (name.includes("trans")) {
    latestSignal = {
      type: "fraud",
      severity: "critical",
      message: "Transaction spike anomaly detected"
    };
  } 
  else {
    latestSignal = {
      type: "portfolio",
      severity: "low",
      message: "Cost inflation trend emerging"
    };
  }

  console.log("📡 LIVE SIGNAL:", latestSignal);
}
app.get("/api/agent-signal", (req, res) => {
  res.json({
    ...latestSignal,
    timestamp: new Date().toISOString()
  });
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📂 Watching live data in: ${DATA_DIR}`);
});