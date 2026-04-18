# ClickCart Nano Commerce

Digital commerce priced per preview, tip, insight, and stream tick.

Track: **Real-Time Micro-Commerce Flow**

## Real Product

This API is protected by real x402 payments through Circle Gateway on Arc Testnet. Users and agents call the paid endpoints with `GatewayClient.pay()`; the seller API verifies and settles through Circle Gateway before returning the resource.

## Financial Problem

Consumer digital goods are forced into ads, subscriptions, bundles, and minimum checkouts because tiny interactions cannot be charged directly.

At sub-cent prices, card fees and one gas transaction per action destroy the margin. Circle Nanopayments let the buyer sign gas-free payment authorizations and settle through Gateway on Arc.

## Live URLs

- Web: https://clickcart-nano-commerce.vercel.app
- API: https://clickcart-nano-commerce-api.onrender.com
- Seller address: `0x5905c9Dea6Ae52AA0947D8F7F218263889eDfC4E`

## Usage

See [HOW_TO_USE.md](./HOW_TO_USE.md).

## Paid Endpoints

- GET `/paid/sample/featured`: $0.0005
- POST `/paid/unlock-insight`: $0.0020
- POST `/paid/creator-tip`: $0.0010
- POST `/paid/stream-tick`: $0.0002
