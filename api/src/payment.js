import { env } from "./config.js";

export async function createPaymentGuard() {
  const { createGatewayMiddleware } = await import("@circle-fin/x402-batching/server");
  const gateway = createGatewayMiddleware({
    sellerAddress: env.sellerAddress,
    networks: [env.arcNetwork],
  });
  return {
    mode: "circle-gateway",
    require: (priceUsd) => gateway.require("$" + priceUsd),
  };
}
