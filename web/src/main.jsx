import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const project = {
  "slug": "clickcart-nano-commerce",
  "title": "ClickCart Nano Commerce",
  "track": "Real-Time Micro-Commerce Flow",
  "tagline": "Digital commerce priced per preview, tip, insight, and stream tick.",
  "problem": "Consumer digital goods are forced into ads, subscriptions, bundles, and minimum checkouts because tiny interactions cannot be charged directly.",
  "demoLabel": "Run 120 paid commerce interactions",
  "actions": [
    {
      "id": "sample",
      "method": "GET",
      "path": "/paid/sample/demo",
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
  "title": "ClickCart Nano Commerce",
  "short": "ClickCart",
  "accent": "#f97316",
  "accent2": "#0d9488",
  "track": "Real-Time Micro-Commerce",
  "pitch": "Charge directly for previews, stream ticks, tips, and unlocks."
};
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

function dollars(value) {
  return "$" + Number(value || 0).toFixed(6);
}

function compactAddress(value) {
  if (!value) return "unknown";
  return value.slice(0, 8) + "..." + value.slice(-4);
}

function App() {
  const [metrics, setMetrics] = useState({ events: [], economics: {} });
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const response = await fetch(API_URL + "/metrics");
    setMetrics(await response.json());
  }

  async function runDemo() {
    setRunning(true);
    setError("");
    try {
      await fetch(API_URL + "/demo/reset", { method: "POST" });
      for (const action of project.actions) {
        for (let i = 0; i < action.units; i++) {
          const response = await fetch(API_URL + action.path, {
            method: action.method,
            headers: {
              "content-type": "application/json",
              "X-DEMO-PAYMENT": "browser-demo-payment",
              "X-DEMO-PAYER": "0x000000000000000000000000000000000000bEEF",
              "X-REQUEST-START": String(Date.now()),
            },
            body: action.method === "GET" ? undefined : JSON.stringify({ sequence: i + 1, goal: project.story }),
          });
          if (!response.ok) throw new Error(await response.text());
          if ((i + 1) % 4 === 0) await refresh();
        }
      }
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    refresh().catch(() => setError("API is not reachable. Start the API or set VITE_API_URL."));
    const id = setInterval(() => refresh().catch(() => {}), 2500);
    return () => clearInterval(id);
  }, []);

  const economics = metrics.economics || {};
  const recent = metrics.events || [];
  const totalPlanned = useMemo(() => project.actions.reduce((sum, action) => sum + action.units, 0), []);
  const progress = Math.min(100, ((economics.successfulPaidActions || 0) / totalPlanned) * 100);

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
            <p className="eyebrow">{brand.track}</p>
            <h1>{project.title}</h1>
            <p className="tagline">{brand.pitch}</p>
            <p className="problem">{project.problem}</p>
            <div className="hero-actions">
              <button onClick={runDemo} disabled={running}>{running ? "Running demo..." : project.demoLabel}</button>
              <span>{totalPlanned}+ priced actions, all at or below $0.01.</span>
            </div>
          </div>
          <div className="terminal">
            <div className="terminal-top"><span></span><span></span><span></span></div>
            <p>$ curl paid-resource</p>
            <p className="dim">402 Payment Required</p>
            <p>$ gateway.pay()</p>
            <p className="success">200 OK · USDC nanopayment settled</p>
            <div className="progress"><i style={{ width: progress + "%" }} /></div>
            <small>{Math.round(progress)}% of demo target complete</small>
          </div>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="metrics">
        <article><span>Paid actions</span><strong>{economics.successfulPaidActions || 0}</strong><small>Target {totalPlanned}</small></article>
        <article><span>Total revenue</span><strong>{dollars(economics.totalRevenueUsd)}</strong><small>USDC revenue</small></article>
        <article><span>Average price</span><strong>{dollars(economics.averagePriceUsd)}</strong><small>Sub-cent unit price</small></article>
        <article><span>Card fee loss</span><strong>{dollars(economics.estimatedCardFeesUsd)}</strong><small>$0.30 + 2.9%</small></article>
        <article><span>Gas loss</span><strong>{dollars(economics.estimatedGasIfOneTxPerActionUsd)}</strong><small>$0.005 per action</small></article>
      </section>

      <section className="workspace">
        <div className="panel actions-panel">
          <div className="panel-title">
            <h2>Priced Actions</h2>
            <span>Production x402 path, local fallback for demos</span>
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
                <small>{action.units} calls</small>
              </div>
            ))}
          </div>
        </div>
        <div className="panel proof-panel">
          <div className="panel-title">
            <h2>Economic Proof</h2>
            <span>Why this needs nanopayments</span>
          </div>
          <p>{economics.explanation || "Run the demo to generate the margin proof."}</p>
          <div className="proof-card">
            <strong>{dollars(economics.totalRevenueUsd)}</strong>
            <span>revenue would face {dollars(economics.estimatedCardFeesUsd)} in card fees.</span>
          </div>
        </div>
      </section>

      <section className="panel feed-panel">
        <div className="panel-title">
          <h2>Live Payment Feed</h2>
          <span>{recent.length} recorded actions</span>
        </div>
        <div className="table">
          <div className="row head"><span>Action</span><span>Amount</span><span>Buyer</span><span>Latency</span></div>
          {recent.slice(0, 20).map((event) => (
            <div className="row" key={event.id}>
              <span>{event.actionType}</span>
              <span>{dollars(event.amountUsd)}</span>
              <span>{compactAddress(event.buyer)}</span>
              <span>{event.latencyMs}ms</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
