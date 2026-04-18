import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import { env, project } from "./config.js";

function ensureStore() {
  fs.mkdirSync(path.dirname(env.dataFile), { recursive: true });
  if (!fs.existsSync(env.dataFile)) {
    fs.writeFileSync(env.dataFile, JSON.stringify({ events: [], jobs: {}, tasks: {} }, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(env.dataFile, "utf8"));
}

function writeStore(data) {
  ensureStore();
  fs.writeFileSync(env.dataFile, JSON.stringify(data, null, 2));
}

export function resetStore() {
  writeStore({ events: [], jobs: {}, tasks: {} });
}

export function listEvents() {
  return readStore().events;
}

export function saveEvent(input) {
  const data = readStore();
  const event = {
    id: nanoid(),
    project: project.title,
    track: project.track,
    seller: env.sellerAddress,
    paymentStatus: "settled",
    network: env.arcNetwork,
    createdAt: new Date().toISOString(),
    ...input,
  };
  data.events.unshift(event);
  writeStore(data);
  return event;
}

export function upsertTask(id, task) {
  const data = readStore();
  data.tasks[id] = { ...(data.tasks[id] || {}), ...task };
  writeStore(data);
  return data.tasks[id];
}

export function getTask(id) {
  return readStore().tasks[id] || null;
}

export function upsertJob(id, job) {
  const data = readStore();
  data.jobs[id] = { ...(data.jobs[id] || {}), ...job };
  writeStore(data);
  return data.jobs[id];
}

export function getJob(id) {
  return readStore().jobs[id] || null;
}
