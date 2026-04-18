import { GatewayClient } from "@circle-fin/x402-batching/client";
import { project } from "../api/src/config.js";

const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const privateKey = process.env.BUYER_PRIVATE_KEY;
const repeat = Number(process.env.REPEAT || "1");

if (!privateKey) {
  console.error("BUYER_PRIVATE_KEY is required. Use a rotated Arc Testnet wallet with Gateway balance.");
  process.exit(1);
}

const client = new GatewayClient({
  chain: process.env.GATEWAY_CHAIN || "arcTestnet",
  privateKey,
  rpcUrl: process.env.ARC_RPC_URL || "https://rpc.testnet.arc.network",
});

console.log("Buyer:", client.address);
console.log("Target API:", apiUrl);

let completed = 0;
for (const action of project.actions) {
  for (let i = 0; i < repeat; i++) {
    const result = await client.pay(apiUrl + action.path, {
      method: action.method,
      body: action.method === "GET" ? undefined : { sequence: i + 1, goal: project.story, action: action.id },
    });
    completed++;
    console.log(JSON.stringify({
      action: action.id,
      status: result.status,
      amount: result.formattedAmount,
      transaction: result.transaction,
      response: result.data,
    }, null, 2));
  }
}

const metrics = await fetch(apiUrl + "/metrics").then((r) => r.json());
console.log(JSON.stringify({ project: project.title, paidActions: completed, economics: metrics.economics }, null, 2));
