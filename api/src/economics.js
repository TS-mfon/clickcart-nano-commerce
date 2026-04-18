import { listEvents } from "./store.js";

export function toNumber(value) {
  return Number.parseFloat(String(value || "0"));
}

export function economics() {
  const events = listEvents();
  const paid = events.filter((event) => event.paymentStatus === "settled");
  const total = paid.reduce((sum, event) => sum + toNumber(event.amountUsd), 0);
  const count = paid.length;
  const prices = paid.map((event) => toNumber(event.amountUsd));
  const cardFees = paid.reduce((sum, event) => sum + 0.30 + toNumber(event.amountUsd) * 0.029, 0);
  const gasBaseline = count * Number(process.env.GAS_BASELINE_USD || "0.005");
  return {
    paidActionCount: events.length,
    successfulPaidActions: count,
    failedPaidActions: events.filter((event) => event.paymentStatus === "failed").length,
    totalRevenueUsd: total.toFixed(6),
    averagePriceUsd: count ? (total / count).toFixed(6) : "0.000000",
    lowestPriceUsd: prices.length ? Math.min(...prices).toFixed(6) : "0.000000",
    highestPriceUsd: prices.length ? Math.max(...prices).toFixed(6) : "0.000000",
    estimatedCardFeesUsd: cardFees.toFixed(6),
    estimatedGasIfOneTxPerActionUsd: gasBaseline.toFixed(6),
    nanopaymentCostAdvantageUsd: Math.max(cardFees, gasBaseline).toFixed(6),
    explanation:
      "This product prices each real x402 action at sub-cent levels. A $0.30 + 2.9% card fee or even $0.005 gas per action exceeds or destroys revenue, while Circle Nanopayments use gas-free authorizations and batched settlement.",
  };
}
