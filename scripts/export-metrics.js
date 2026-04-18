import fs from "node:fs";
const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const out = process.env.OUT || "./demo-metrics.json";
const metrics = await fetch(apiUrl + "/metrics").then((r) => r.json());
fs.writeFileSync(out, JSON.stringify(metrics, null, 2));
console.log("wrote", out);
