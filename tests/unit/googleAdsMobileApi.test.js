import test from "node:test";
import assert from "node:assert/strict";

import {
  createGoogleAdsMobileApiClient,
  GOOGLEADS_MOBILE_CONTRACT_VERSION,
  isContractMismatch,
} from "../../src/vue/services/googleAdsMobileApi.js";

test("google ads mobile api client falls back to mock mode without env", async () => {
  const client = createGoogleAdsMobileApiClient({ fetchImpl: undefined });
  const summary = await client.getSummary();

  assert.equal(client.mockMode, true);
  assert.equal(summary.mockMode, true);
  assert.equal(summary.mobile_api_contract_version, GOOGLEADS_MOBILE_CONTRACT_VERSION);
});

test("google ads mobile api client sends api key and outbox payload", async () => {
  const requests = [];
  const client = createGoogleAdsMobileApiClient({
    baseUrl: "https://ads.example.test/",
    apiKey: "test-key",
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return {
        ok: true,
        json: async () => ({ ok: true, event_id: "evt-1" }),
      };
    },
  });

  const response = await client.sendApprovalEvent("act-1", "APPROVE");

  assert.equal(response.ok, true);
  assert.equal(requests[0].url, "https://ads.example.test/api/mobile/outbox");
  assert.equal(requests[0].init.headers["X-API-Key"], "test-key");
  const body = JSON.parse(requests[0].init.body);
  assert.equal(body.source, "lipyum_mobile_panel");
  assert.equal(body.action_id, "act-1");
  assert.equal(body.event_type, "APPROVE");
  assert.ok(body.client_request_id);
});

test("contract mismatch warning ignores mock payloads", () => {
  assert.equal(isContractMismatch({ mockMode: true }), false);
  assert.equal(isContractMismatch({ mobile_api_contract_version: "0.9.0" }), true);
});
