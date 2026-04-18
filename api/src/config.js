export const project = {
  "slug": "clickcart-nano-commerce",
  "title": "ClickCart Nano Commerce",
  "track": "Real-Time Micro-Commerce Flow",
  "tagline": "Digital commerce priced per preview, tip, insight, and stream tick.",
  "problem": "Consumer digital goods are forced into ads, subscriptions, bundles, and minimum checkouts because tiny interactions cannot be charged directly.",
    "actions": [
    {
      "id": "sample",
      "method": "GET",
      "path": "/paid/sample/featured",
      "label": "Preview Sample",
      "price": "0.0005",
      "units": 30
    },
    {
      "id": "unlock-insight",
      "method": "POST",
      "path": "/paid/unlock-insight",
      "label": "Unlock Insight",
      "price": "0.0020",
      "units": 20
    },
    {
      "id": "creator-tip",
      "method": "POST",
      "path": "/paid/creator-tip",
      "label": "Creator Tip",
      "price": "0.0010",
      "units": 20
    },
    {
      "id": "stream-tick",
      "method": "POST",
      "path": "/paid/stream-tick",
      "label": "Stream Tick",
      "price": "0.0002",
      "units": 50
    }
  ],
  "story": "A buyer session pays per small commerce interaction instead of starting a subscription or using ad inventory."
};

export const env = {
  port: Number(process.env.PORT || 8787),
  sellerAddress: process.env.SELLER_ADDRESS || "0x5905c9Dea6Ae52AA0947D8F7F218263889eDfC4E",
  arcNetwork: process.env.ARC_NETWORK || "eip155:5042002",
  arcRpcUrl: process.env.ARC_RPC_URL || "https://rpc.testnet.arc.network",
  arcUsdcAddress: process.env.ARC_USDC_ADDRESS || "0x3600000000000000000000000000000000000000",
  enableRealX402: true,
  dataFile: process.env.DATA_FILE || "./data/events.json",
  receiptContract: process.env.RECEIPT_CONTRACT_ADDRESS || "",
};
