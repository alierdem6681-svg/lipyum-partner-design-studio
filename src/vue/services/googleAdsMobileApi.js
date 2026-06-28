export const GOOGLEADS_MOBILE_CONTRACT_VERSION = "1.0.0";

function readEnv() {
  return import.meta.env || {};
}

function normalizeBaseUrl(value) {
  return String(value || "").replace(/\/+$/, "");
}

function makeClientRequestId(prefix = "lipyum-panel") {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function isContractMismatch(payload) {
  if (!payload || payload.mockMode) return false;
  return payload.mobile_api_contract_version !== GOOGLEADS_MOBILE_CONTRACT_VERSION;
}

export function createGoogleAdsMobileApiClient(options = {}) {
  const env = readEnv();
  const baseUrl = normalizeBaseUrl(options.baseUrl ?? env.VITE_GOOGLEADS_MOBILE_API_BASE_URL);
  const apiKey = String(options.apiKey ?? env.VITE_GOOGLEADS_MOBILE_API_KEY ?? "");
  const panelVersion = String(options.panelVersion ?? env.VITE_APP_VERSION ?? "lipyum-panel-local");
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const mockMode = !baseUrl || !apiKey || typeof fetchImpl !== "function";

  function headers(extra = {}) {
    return {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      "X-Lipyum-Panel-Version": panelVersion,
      ...extra,
    };
  }

  async function request(path, init = {}) {
    if (mockMode) {
      return { ok: true, mockMode: true, source: "local_mock", mobile_api_contract_version: GOOGLEADS_MOBILE_CONTRACT_VERSION };
    }
    const response = await fetchImpl(`${baseUrl}${path}`, {
      ...init,
      headers: headers(init.headers),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { ok: false, status: response.status, ...payload };
    }
    return payload;
  }

  return {
    mockMode,
    panelVersion,
    async getSummary() {
      return request("/api/mobile/summary");
    },
    async getActions() {
      return request("/api/mobile/actions");
    },
    async sendApprovalEvent(actionId, eventType, extra = {}) {
      return request("/api/mobile/outbox", {
        method: "POST",
        body: JSON.stringify({
          action_id: actionId,
          event_type: eventType,
          source: "lipyum_mobile_panel",
          client_request_id: makeClientRequestId(actionId),
          created_at_client: new Date().toISOString(),
          ...extra,
        }),
      });
    },
  };
}
