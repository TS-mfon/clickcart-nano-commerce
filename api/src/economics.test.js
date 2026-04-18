import assert from "node:assert/strict";
import test from "node:test";
import { project } from "./config.js";
import { economics } from "./economics.js";
import { resetStore, saveEvent } from "./store.js";

test("all configured prices are at or below one cent", () => {
  for (const action of project.actions) {
    assert.ok(Number(action.price) <= 0.01, action.id + " is above $0.01");
  }
});

test("economics captures card fee failure", () => {
  resetStore();
  saveEvent({ actionType: "test", endpoint: "/paid/test", buyer: "0x1", amountUsd: "0.0010", amountMicrousd: 1000, resourceId: "r", requestHash: "h", latencyMs: 1 });
  const snapshot = economics();
  assert.equal(snapshot.successfulPaidActions, 1);
  assert.ok(Number(snapshot.estimatedCardFeesUsd) > Number(snapshot.totalRevenueUsd));
});
