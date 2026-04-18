# How To Use ClickCart Nano Commerce

## 1. Run The API Locally

```bash
cd /home/sudodave/clickcart-nano-commerce/api
npm install
ENABLE_REAL_X402=false npm start
```

The API starts on `http://127.0.0.1:8787` by default. Use `PORT=8788` or another port if needed.

## 2. Run The Dashboard

```bash
cd /home/sudodave/clickcart-nano-commerce/web
npm install
VITE_API_URL=http://127.0.0.1:8787 npm run dev
```

Open the Vite URL and click the demo button. The dashboard records paid actions, revenue, average price, and the card/gas margin failure.

## 3. Run The Demo Script

```bash
cd /home/sudodave/clickcart-nano-commerce/api
ENABLE_REAL_X402=false npm start
```

In another terminal:

```bash
cd /home/sudodave/clickcart-nano-commerce/api
npm run demo:run
```

Expected demo: 120 paid actions across 4 priced endpoint(s).

## 4. Use Real Circle Nanopayments

Rotate any exposed keys before doing this.

```bash
cd /home/sudodave/clickcart-nano-commerce/api
BUYER_PRIVATE_KEY=0x... npm run demo:deposit
USE_REAL_GATEWAY=true BUYER_PRIVATE_KEY=0x... API_URL=https://your-render-api.example.com npm run demo:run
```

Set these environment variables in Render:

```bash
SELLER_ADDRESS=0x...
ARC_RPC_URL=https://rpc.testnet.arc.network
ARC_NETWORK=eip155:5042002
ARC_USDC_ADDRESS=0x3600000000000000000000000000000000000000
ENABLE_REAL_X402=true
```

## 5. Paid Endpoints

- `GET /paid/sample/demo` costs `$0.0005` and runs 30 times in the demo.
- `POST /paid/unlock-insight` costs `$0.0020` and runs 20 times in the demo.
- `POST /paid/creator-tip` costs `$0.0010` and runs 20 times in the demo.
- `POST /paid/stream-tick` costs `$0.0002` and runs 50 times in the demo.

## 6. Verification Commands

```bash
cd /home/sudodave/clickcart-nano-commerce/api && npm test
cd /home/sudodave/clickcart-nano-commerce/web && npm run build
cd /home/sudodave/clickcart-nano-commerce/contracts && forge test
```
