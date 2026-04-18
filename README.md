# ClickCart Nano Commerce

Digital commerce priced per preview, tip, insight, and stream tick.

Track: **Real-Time Micro-Commerce Flow**

## What It Does

A buyer session pays per small commerce interaction instead of starting a subscription or using ad inventory.

Each action is priced below one cent and protected by x402/Circle Gateway Nanopayments. The local fallback mode exists so the UI and economics can be tested without live Gateway credentials, but the production path uses Circle's Gateway middleware and buyer client.

## Financial Problem

Consumer digital goods are forced into ads, subscriptions, bundles, and minimum checkouts because tiny interactions cannot be charged directly.

The demo proves the margin problem directly. At sub-cent prices, card fees of $0.30 + 2.9% or a normal onchain transaction per action exceed the revenue. Circle Nanopayments let buyers sign gas-free authorizations and use batched settlement on Arc.

## Architecture

- `api/`: Express seller API with x402 Gateway middleware.
- `web/`: Vite dashboard with live metrics and demo runner.
- `scripts/`: deposit, demo, and metrics export scripts.
- `contracts/`: optional Arc receipt logger for explorer-visible proof.

## Setup

```bash
cd api
npm install
cp ../.env.example .env
npm run dev
```

```bash
cd web
npm install
VITE_API_URL=http://localhost:8787 npm run dev
```

## Real Gateway Demo

Rotate any exposed keys first. Then fund the buyer with Arc Testnet USDC from the Circle faucet and deposit to Gateway:

```bash
cd api
BUYER_PRIVATE_KEY=0x... npm run demo:deposit
USE_REAL_GATEWAY=true BUYER_PRIVATE_KEY=0x... API_URL=https://your-api.example.com npm run demo:run
```

## Local Fallback Demo

```bash
cd api
ENABLE_REAL_X402=false npm run dev
npm run demo:run
```

## Paid Actions

- GET `/paid/sample/demo`: $0.0005, 30 demo calls
- POST `/paid/unlock-insight`: $0.0020, 20 demo calls
- POST `/paid/creator-tip`: $0.0010, 20 demo calls
- POST `/paid/stream-tick`: $0.0002, 50 demo calls

## Acceptance Criteria

- Unpaid protected requests return HTTP 402.
- Paid requests return useful JSON and record payment metrics.
- The demo creates at least 50 paid actions.
- Every action is priced at or below $0.01.
- The dashboard explains why cards and normal gas break the model.
