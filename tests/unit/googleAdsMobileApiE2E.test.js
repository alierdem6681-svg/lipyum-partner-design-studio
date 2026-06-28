import test from "node:test";
import assert from "node:assert/strict";

import { createGoogleAdsMobileApiClient, GOOGLEADS_MOBILE_CONTRACT_VERSION } from "../../src/vue/services/googleAdsMobileApi.js";

test("google ads mobile api adapter supports live gateway smoke flow", async () => {
  const calls = [];
  const client = createGoogleAdsMobileApiClient({
    baseUrl: "http://127.0.0.1:8755",
    apiKey: "test-key",
    panelVersion: "unit-panel",
    fetchImpl: async (url, init = {}) => {
      calls.push({ url, init });
      if (url.endsWith("/api/mobile/health")) {
        return { ok: true, json: async () => ({ ok: true, mobile_api_contract_version: GOOGLEADS_MOBILE_CONTRACT_VERSION }) };
      }
      if (url.endsWith("/api/mobile/summary")) {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            mobile_api_contract_version: GOOGLEADS_MOBILE_CONTRACT_VERSION,
            snapshot_freshness: { overall: "FRESH" },
          }),
        };
      }
      if (url.endsWith("/api/mobile/outbox")) {
        return { ok: true, json: async () => ({ ok: true, duplicate: false, event_id: "evt-1" }) };
      }
      return { ok: false, status: 404, json: async () => ({ error: "NOT_FOUND" }) };
    },
  });

  const health = await client.getHealth();
  const summary = await client.getSummary();
  const outbox = await client.sendApprovalEvent("act-1", "APPROVE", { client_request_id: "req-1" });

  assert.equal(health.ok, true);
  assert.equal(summary.snapshot_freshness.overall, "FRESH");
  assert.equal(outbox.event_id, "evt-1");
  assert.equal(calls[0].url, "http://127.0.0.1:8755/api/mobile/health");
  assert.equal(calls[1].init.headers["X-API-Key"], "test-key");
  assert.equal(calls[2].init.headers["X-Lipyum-Panel-Version"], "unit-panel");
  assert.equal(JSON.parse(calls[2].init.body).source, "lipyum_mobile_panel");
});
