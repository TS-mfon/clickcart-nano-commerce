const key = process.env.BUYER_PRIVATE_KEY;
if (!key) {
  console.error("BUYER_PRIVATE_KEY is required for a real Gateway deposit.");
  process.exit(1);
}
const { GatewayClient } = await import("@circle-fin/x402-batching/client");
const client = new GatewayClient({ chain: process.env.GATEWAY_CHAIN || "arcTestnet", privateKey: key });
const balances = await client.getBalances();
console.log("Gateway balance before deposit:", balances.gateway);
const minimum = BigInt(process.env.MIN_GATEWAY_MICRO_USDC || "1000000");
if (balances.gateway.available < minimum) {
  const amount = process.env.GATEWAY_DEPOSIT_USDC || "1";
  console.log("Depositing", amount, "USDC to Gateway...");
  await client.deposit(amount);
}
console.log("Gateway balance after:", await client.getBalances());
