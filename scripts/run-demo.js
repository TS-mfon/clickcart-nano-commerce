import { project } from "../api/src/config.js";

const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const useRealGateway = process.env.USE_REAL_GATEWAY === "true";

async function pay(url, action, body) {
  if (useRealGateway) {
    const { GatewayClient } = await import("@circle-fin/x402-batching/client");
    const client = new GatewayClient({
      chain: process.env.GATEWAY_CHAIN || "arcTestnet",
      privateKey: process.env.BUYER_PRIVATE_KEY,
    });
    return client.pay(url, action.method === "GET" ? undefined : {
      method: action.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  const response = await fetch(url, {
    method: action.method,
    headers: {
      "content-type": "application/json",
      "X-DEMO-PAYMENT": "signed-local-demo-payment",
      "X-DEMO-PAYER": process.env.DEMO_BUYER_ADDRESS || "0x000000000000000000000000000000000000bEEF",
      "X-REQUEST-START": String(Date.now()),
    },
    body: action.method === "GET" ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`${action.id} failed with ${response.status}: ${await response.text()}`);
  }
  return { status: response.status, data: await response.json() };
}

await fetch(apiUrl + "/demo/reset", { method: "POST" });
await fetch(apiUrl + "/jobs", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ id: "demo", totalRows: 100 }),
}).catch(() => {});

let completed = 0;
for (const action of project.actions) {
  for (let i = 0; i < action.units; i++) {
    const body = { sequence: i + 1, goal: project.story, action: action.id };
    await pay(apiUrl + action.path, action, body);
    completed++;
    if (completed % 10 === 0) console.log(`completed ${completed} paid actions`);
  }
}

const metrics = await fetch(apiUrl + "/metrics").then((r) => r.json());
console.log(JSON.stringify({ project: project.title, completed, economics: metrics.economics }, null, 2));
