# Agent Instructions

## Project Context
- Project: `ApycueAutomationProject`
- Stack: `Playwright` + `TypeScript`
- Test style: `POM (Page Object Model)` + `test.step()` structured scenarios

## Setup Commands
- Install dependencies: `npm install`
- Install Playwright browsers: `npx.cmd playwright install`

## Execution Commands
- Run all tests: `npx.cmd playwright test`
- Run Chromium suite: `npx.cmd playwright test --project=chromium`
- Run login spec only: `npx.cmd playwright test tests/login.spec.ts --project=chromium`
- Run create hotel spec only: `npx.cmd playwright test tests/createHotel.spec.ts --project=chromium`
- Show report: `npx.cmd playwright show-report`

## Google Sheet Commands
- Sync master automation sheet: `npm run sheet:sync`
- Push run results to a new run tab: `npm run sheet:results`
- Run chromium tests + update results tab: `npm run test:and:sync`

## Test Authoring Rules
- Keep test IDs in title format: `TC_NO_XXXX: <description>`
- Prefer stable selectors: `id`, role+name, label, placeholder.
- Add/modify locators in page classes first, then use them in specs.
- Use clear `test.step()` messages for every user action and assertion.
- Validate exact text where UI copy is contractually important.
- Add fallback logic only where UI behavior differs by role/environment.

## Change Workflow
1. Understand current DOM/flow and existing spec coverage.
2. Update page object locators.
3. Add/adjust tests in relevant spec.
4. Run only impacted specs first.
5. Run broader suite when changes affect shared flows.

## Validation Expectations
- Always run at least one real verification command after edits.
- If test fails, capture:
  - failing `TC_NO`
  - root cause
  - fix applied
  - rerun result

## Guardrails
- Do not hardcode secrets or credentials in code/tests.
- Do not remove existing stable coverage unless explicitly requested.
- Do not rename existing `TC_NO_*` IDs without approval.
- Keep assertions resilient but meaningful (avoid weak always-true checks).

## Output / Reporting
- Share:
  - changed files
  - commands executed
  - pass/fail summary
- If partially complete, clearly list remaining gaps and next command to run.
