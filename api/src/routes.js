import crypto from "node:crypto";
import express from "express";
import { nanoid } from "nanoid";
import { project } from "./config.js";
import { economics } from "./economics.js";
import { getJob, getTask, listEvents, resetStore, saveEvent, upsertJob, upsertTask } from "./store.js";

function hash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function buildResult(actionId, sequence, req) {
  switch (actionId) {
    case "sample":
      return {
        ok: true,
        action: "sample",
        label: "Preview Sample",
        sequence,
        result: "Preview Sample result #" + sequence,
        score: 26 + (sequence % 17),
        payload: req.body || null,
      };
    case "unlock-insight":
      return {
        ok: true,
        action: "unlock-insight",
        label: "Unlock Insight",
        sequence,
        result: "Unlock Insight result #" + sequence,
        score: 39 + (sequence % 17),
        payload: req.body || null,
      };
    case "creator-tip":
      return {
        ok: true,
        action: "creator-tip",
        label: "Creator Tip",
        sequence,
        result: "Creator Tip result #" + sequence,
        score: 52 + (sequence % 17),
        payload: req.body || null,
      };
    case "stream-tick":
      return {
        ok: true,
        action: "stream-tick",
        label: "Stream Tick",
        sequence,
        result: "Stream Tick result #" + sequence,
        score: 65 + (sequence % 17),
        payload: req.body || null,
      };
    default:
      return { ok: true, action: actionId, sequence };
  }
}

function paidHandler(actionId, label, amountUsd) {
  return (req, res) => {
    const started = Number(req.header("X-REQUEST-START") || Date.now());
    const sequence = listEvents().length + 1;
    const result = buildResult(actionId, sequence, req);
    const buyer = req.payment?.payer || "unknown";
    const event = saveEvent({
      actionType: actionId,
      endpoint: req.originalUrl,
      buyer,
      amountUsd,
      amountMicrousd: Math.round(Number(amountUsd) * 1000000),
      resourceId: hash({ actionId, sequence }).slice(0, 32),
      requestHash: hash({ headers: req.headers, body: req.body, actionId }),
      paymentResponse: req.header("PAYMENT-RESPONSE") || "circle-gateway",
      gatewayTransferId: req.payment?.transaction || "",
      latencyMs: Math.max(1, Date.now() - started),
    });

    if (actionId === "process-row") {
      const job = getJob(req.params.jobId || "default") || { id: "default", totalRows: 100, processedRows: 0, results: [] };
      const processedRows = job.processedRows + 1;
      upsertJob(req.params.jobId || "default", {
        status: processedRows >= job.totalRows ? "complete" : "running",
        processedRows,
        totalRows: job.totalRows,
        pricePerRowUsd: amountUsd,
        totalSpendUsd: (processedRows * Number(amountUsd)).toFixed(6),
        results: [...(job.results || []), { rowId: String(processedRows), score: result.score, category: result.score > 60 ? "priority" : "standard" }],
      });
    }

    res.json({ paid: true, label, amountUsd, event, result });
  };
}

export function registerRoutes(app, guard) {
  app.get("/health", (_req, res) => res.json({ ok: true, project: project.title, paymentMode: guard.mode }));
  app.get("/config", (_req, res) => res.json({ project }));
  app.get("/metrics", (_req, res) => res.json({ events: listEvents(), economics: economics() }));
  app.get("/economics", (_req, res) => res.json(economics()));
  app.post("/admin/reset", (req, res) => {
    const configuredToken = process.env.ADMIN_TOKEN;
    if (!configuredToken || req.header("X-ADMIN-TOKEN") !== configuredToken) {
      return res.status(403).json({ error: "admin token required" });
    }
    resetStore();
    res.json({ ok: true });
  });
  app.post("/jobs", (req, res) => {
    const id = req.body?.id || "default";
    const totalRows = Number(req.body?.totalRows || 100);
    res.json(upsertJob(id, { id, status: "queued", totalRows, processedRows: 0, pricePerRowUsd: "0.0008", totalSpendUsd: "0.000000", results: [] }));
  });
  app.get("/jobs/:id", (req, res) => res.json(getJob(req.params.id) || { error: "job not found" }));
  app.post("/buyer/tasks", (req, res) => {
    const id = nanoid();
    res.json(upsertTask(id, { id, status: "created", goal: req.body?.goal || project.story, budgetUsd: req.body?.budgetUsd || "0.150000", createdAt: new Date().toISOString() }));
  });
  app.get("/buyer/tasks/:id", (req, res) => res.json(getTask(req.params.id) || { error: "task not found" }));
  app.get("/agents", (_req, res) => res.json([
    { id: "buyer", role: "BuyerAgent", budgeted: true },
    { id: "data", role: "DataAgent", price: "0.0010" },
    { id: "compute", role: "ComputeAgent", price: "0.0020" },
    { id: "verifier", role: "VerifierAgent", price: "0.0005" },
  ]));
  app.get("/catalog", (_req, res) => res.json([
    { id: "sample", label: "Preview sample", price: "0.0005" },
    { id: "insight", label: "Premium insight", price: "0.0020" },
    { id: "tip", label: "Creator tip", price: "0.0010" },
    { id: "tick", label: "Stream tick", price: "0.0002" },
  ]));
  app.get("/paid/sample/:id", guard.require("0.0005"), paidHandler("sample", "Preview Sample", "0.0005"));
  app.post("/paid/unlock-insight", guard.require("0.0020"), paidHandler("unlock-insight", "Unlock Insight", "0.0020"));
  app.post("/paid/creator-tip", guard.require("0.0010"), paidHandler("creator-tip", "Creator Tip", "0.0010"));
  app.post("/paid/stream-tick", guard.require("0.0002"), paidHandler("stream-tick", "Stream Tick", "0.0002"));
}
