import { env } from "./config.js";

function toAtomicUsdc(priceUsd) {
  const [whole, frac = ""] = String(priceUsd).replace("$", "").split(".");
  const padded = (frac + "000000").slice(0, 6);
  return String(BigInt(whole || "0") * 1000000n + BigInt(padded || "0"));
}

function fallbackRequirement(priceUsd, resource) {
  return {
    x402Version: 2,
    accepts: [
      {
        scheme: "exact",
        network: env.arcNetwork,
        asset: env.arcUsdcAddress,
        amount: toAtomicUsdc(priceUsd),
        payTo: env.sellerAddress,
        maxTimeoutSeconds: 345600,
        resource,
        extra: {
          name: "GatewayWalletBatched",
          version: "1",
          note: "Fallback x402-shaped response for local demos when Circle packages are unavailable.",
        },
      },
    ],
  };
}

export async function createPaymentGuard() {
  if (env.enableRealX402) {
    try {
      const { createGatewayMiddleware } = await import("@circle-fin/x402-batching/server");
      const gateway = createGatewayMiddleware({
        sellerAddress: env.sellerAddress,
        networks: [env.arcNetwork],
      });
      return {
        mode: "circle-gateway",
        require: (priceUsd) => gateway.require("$" + priceUsd),
      };
    } catch (error) {
      console.warn("[payment] Circle x402 middleware unavailable, using local fallback:", error.message);
    }
  }

  return {
    mode: "local-fallback",
    require(priceUsd) {
      return (req, res, next) => {
        const signature = req.header("PAYMENT-SIGNATURE") || req.header("X-PAYMENT") || req.header("X-DEMO-PAYMENT");
        if (!signature) {
          return res.status(402).json(fallbackRequirement(priceUsd, req.originalUrl));
        }
        req.payment = {
          payer: req.header("X-DEMO-PAYER") || "0x000000000000000000000000000000000000bEEF",
          amount: priceUsd,
          network: env.arcNetwork,
          response: signature,
        };
        next();
      };
    },
  };
}
