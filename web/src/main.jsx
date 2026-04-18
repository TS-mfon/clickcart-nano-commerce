import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const project = {
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
const brand = {
  "slug": "clickcart-nano-commerce",
  "short": "ClickCart",
  "accent": "#f97316",
  "accent2": "#0d9488",
  "api": "https://clickcart-nano-commerce-api.onrender.com"
};
const API_URL = import.meta.env.VITE_API_URL || "https://clickcart-nano-commerce-api.onrender.com";
const SELLER_ADDRESS = "0x5905c9Dea6Ae52AA0947D8F7F218263889eDfC4E";

function dollars(value) {
  return "$" + Number(value || 0).toFixed(6);
}

function compactAddress(value) {
  if (!value) return "unknown";
  return value.slice(0, 8) + "..." + value.slice(-4);
}

function App() {
  const [metrics, setMetrics] = useState({ events: [], economics: {} });
  const [requirement, setRequirement] = useState(null);
  const [error, setError] = useState("");

  async function refresh() {
    const response = await fetch(API_URL + "/metrics");
    setMetrics(await response.json());
  }

  async function inspectPayment() {
    setError("");
    setRequirement(null);
    try {
      const action = project.actions[0];
      const response = await fetch(API_URL + action.path, {
        method: action.method,
        headers: { "content-type": "application/json" },
        body: action.method === "GET" ? undefined : JSON.stringify({ probe: true }),
      });
      const header = response.headers.get("PAYMENT-REQUIRED");
      if (!header) {
        throw new Error("No x402 PAYMENT-REQUIRED header returned.");
      }
      setRequirement(JSON.parse(atob(header)));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    refresh().catch(() => setError("API is not reachable. Check the Render service URL."));
    const id = setInterval(() => refresh().catch(() => {}), 4000);
    return () => clearInterval(id);
  }, []);

  const economics = metrics.economics || {};
  const recent = metrics.events || [];
  const totalConfigured = useMemo(() => project.actions.reduce((sum, action) => sum + action.units, 0), []);

  return (
    <main style={{ "--accent": brand.accent, "--accent-2": brand.accent2 }}>
      <section className="hero">
        <nav>
          <div className="brandmark">{brand.short.slice(0, 2).toUpperCase()}</div>
          <span>{brand.short}</span>
          <a href={API_URL + "/health"}>API health</a>
        </nav>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Real Arc x402 product</p>
            <h1>{project.title}</h1>
            <p className="tagline">{brand.pitch}</p>
            <p className="problem">{project.problem}</p>
            <div className="hero-actions">
              <button onClick={inspectPayment}>Inspect x402 payment terms</button>
              <span>Payments require Circle Gateway x402 on Arc Testnet.</span>
            </div>
          </div>
          <div className="terminal">
            <div className="terminal-top"><span></span><span></span><span></span></div>
            <p>$ npm run gateway:deposit</p>
            <p className="dim">fund Gateway balance on Arc Testnet</p>
            <p>$ npm run gateway:pay</p>
            <p className="success">GatewayClient signs, settles, and returns paid resource data</p>
            <small>Seller: {compactAddress(SELLER_ADDRESS)}</small>
          </div>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="metrics">
        <article><span>Settled paid actions</span><strong>{economics.successfulPaidActions || 0}</strong><small>Real x402 calls recorded</small></article>
        <article><span>Total revenue</span><strong>{dollars(economics.totalRevenueUsd)}</strong><small>USDC revenue</small></article>
        <article><span>Average price</span><strong>{dollars(economics.averagePriceUsd)}</strong><small>Sub-cent unit price</small></article>
        <article><span>Card fee loss</span><strong>{dollars(economics.estimatedCardFeesUsd)}</strong><small>$0.30 + 2.9%</small></article>
        <article><span>Gas loss</span><strong>{dollars(economics.estimatedGasIfOneTxPerActionUsd)}</strong><small>$0.005 per action</small></article>
      </section>

      <section className="workspace">
        <div className="panel actions-panel">
          <div className="panel-title">
            <h2>Real Paid Endpoints</h2>
            <span>{totalConfigured} configured product actions</span>
          </div>
          <div className="actions">
            {project.actions.map((action, index) => (
              <div className="action" key={action.id}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <div>
                  <strong>{action.label}</strong>
                  <span>{action.method} {action.path}</span>
                </div>
                <em>${action.price}</em>
                <small>Gateway x402</small>
              </div>
            ))}
          </div>
        </div>
        <div className="panel proof-panel">
          <div className="panel-title">
            <h2>How To Pay</h2>
            <span>For people and agents</span>
          </div>
          <p>Use a rotated Arc Testnet wallet with USDC from the Circle faucet. Deposit once to Circle Gateway, then call paid endpoints with <code>GatewayClient.pay()</code>.</p>
          <pre>{`cd clickcart-nano-commerce/api\nBUYER_PRIVATE_KEY=0x... npm run gateway:deposit`}</pre>
          <pre>{`cd clickcart-nano-commerce/api\nBUYER_PRIVATE_KEY=0x... API_URL=https://clickcart-nano-commerce-api.onrender.com npm run gateway:pay`}</pre>
        </div>
      </section>

      {requirement && (
        <section className="panel">
          <div className="panel-title">
            <h2>x402 Payment Requirement</h2>
            <span>{project.actions[0].label}</span>
          </div>
          <pre>{JSON.stringify(requirement, null, 2)}</pre>
        </section>
      )}

      <section className="panel feed-panel">
        <div className="panel-title">
          <h2>Real Payment Feed</h2>
          <span>{recent.length} recorded settlements</span>
        </div>
        <div className="table">
          <div className="row head"><span>Action</span><span>Amount</span><span>Buyer</span><span>Gateway Tx</span></div>
          {recent.slice(0, 20).map((event) => (
            <div className="row" key={event.id}>
              <span>{event.actionType}</span>
              <span>{dollars(event.amountUsd)}</span>
              <span>{compactAddress(event.buyer)}</span>
              <span>{event.gatewayTransferId ? compactAddress(event.gatewayTransferId) : "settled"}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
