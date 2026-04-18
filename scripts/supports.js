import { GatewayClient } from "@circle-fin/x402-batching/client";
import { project } from "../api/src/config.js";

const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const privateKey = process.env.BUYER_PRIVATE_KEY;

if (!privateKey) {
  console.error("BUYER_PRIVATE_KEY is required.");
  process.exit(1);
}

const client = new GatewayClient({
  chain: process.env.GATEWAY_CHAIN || "arcTestnet",
  privateKey,
  rpcUrl: process.env.ARC_RPC_URL || "https://rpc.testnet.arc.network",
});

for (const action of project.actions) {
  const result = await client.supports(apiUrl + action.path);
  console.log(action.id, JSON.stringify(result, null, 2));
}
