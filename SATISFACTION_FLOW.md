# Satisfaction Flow

The satisfaction flow is a compliance-safe mock UI for future native review and support feedback handling.

## Route

- `#/satisfaction`

## Flow

1. User selects a 1-5 star rating.
2. If the user selects 5 stars, the UI offers a store review CTA.
3. Store review text explicitly says the action only starts if the user approves it.
4. The prototype does not claim to submit a store review automatically.
5. If the user selects 1-4 stars, the UI asks what can be improved and creates a mock support feedback record.

## Test Coverage

- `tests/e2e/satisfaction.spec.js`
- 5-star store CTA visibility and mock success.
- 1-4 star support feedback form and mock success.

## Native Readiness TODO

- Connect 5-star CTA to native in-app review APIs when a native shell exists.
- Connect low-score feedback to a real ticket/CRM endpoint when backend APIs exist.
