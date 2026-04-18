# How To Use ClickCart Nano Commerce For Real Arc Payments

This is no longer a simulation. The deployed API requires real x402 payments through Circle Gateway on Arc Testnet.

## Live URLs

- Web: https://clickcart-nano-commerce.vercel.app
- API: https://clickcart-nano-commerce-api.onrender.com
- Seller address: `0x5905c9Dea6Ae52AA0947D8F7F218263889eDfC4E`
- Network: Arc Testnet, `eip155:5042002`

## 1. Prepare A Buyer Wallet

Use a fresh rotated test wallet. Fund it with Arc Testnet USDC from the Circle faucet.

Do not use the private key that was pasted in chat.

## 2. Deposit To Circle Gateway

```bash
cd /home/sudodave/clickcart-nano-commerce/api
BUYER_PRIVATE_KEY=0xYOUR_ROTATED_PRIVATE_KEY npm run gateway:deposit
```

## 3. Pay For A Product Action

```bash
cd /home/sudodave/clickcart-nano-commerce/api
BUYER_PRIVATE_KEY=0xYOUR_ROTATED_PRIVATE_KEY API_URL=https://clickcart-nano-commerce-api.onrender.com npm run gateway:pay
```

Set `REPEAT=10` to make repeated real purchases:

```bash
BUYER_PRIVATE_KEY=0xYOUR_ROTATED_PRIVATE_KEY API_URL=https://clickcart-nano-commerce-api.onrender.com REPEAT=10 npm run gateway:pay
```

## 4. Agent Integration

```js
import { GatewayClient } from "@circle-fin/x402-batching/client";

const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey: process.env.BUYER_PRIVATE_KEY,
  rpcUrl: "https://rpc.testnet.arc.network",
});

const result = await client.pay("https://clickcart-nano-commerce-api.onrender.com/paid/sample/featured", {
  method: "GET",
  body: undefined,
});

console.log(result.transaction, result.data);
```

## 5. Paid Endpoints

- `GET /paid/sample/featured` costs `$0.0005`.
- `POST /paid/unlock-insight` costs `$0.0020`.
- `POST /paid/creator-tip` costs `$0.0010`.
- `POST /paid/stream-tick` costs `$0.0002`.

## 6. Verify Payment Requirements

```bash
cd /home/sudodave/clickcart-nano-commerce/api
BUYER_PRIVATE_KEY=0xYOUR_ROTATED_PRIVATE_KEY API_URL=https://clickcart-nano-commerce-api.onrender.com npm run gateway:supports
```

## 7. Local Development

```bash
cd /home/sudodave/clickcart-nano-commerce/api
npm install
SELLER_ADDRESS=0x5905c9Dea6Ae52AA0947D8F7F218263889eDfC4E npm start
```

```bash
cd /home/sudodave/clickcart-nano-commerce/web
npm install
VITE_API_URL=http://127.0.0.1:8787 npm run dev
```

## 8. Verification

```bash
cd /home/sudodave/clickcart-nano-commerce/api && npm test
cd /home/sudodave/clickcart-nano-commerce/web && npm run build
cd /home/sudodave/clickcart-nano-commerce/contracts && forge test
```
