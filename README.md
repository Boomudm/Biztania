# Eco-Alert AI Concierge

ต้นแบบระบบประสานข้อมูลเหตุสิ่งแวดล้อมจากหลักฐานประชาชน โดย AI ทำหน้าที่ทำความเข้าใจหลักฐาน เชื่อมโยงแหล่งข้อมูล และเตรียมรายงานสำหรับเจ้าหน้าที่ ไม่ใช่ระบบวินิจฉัยสารเคมี

## Architecture

```text
Citizen
  ↓
Evidence (optional text, image, GPS, time)
  ↓
AI Evidence Understanding                    [REAL when configured / deterministic fallback]
  ↓
Context Retrieval                            [MOCK providers]
  ↓
Nearby Report Retrieval                      [MOCK Traffy / FUTURE documented Traffy API]
  ↓
Incident Clustering                          [REAL deterministic application logic]
  ↓
Urgency Engine                               [REAL deterministic application logic]
  ↓
AI Grounded Explanation                      [REAL when configured / deterministic fallback]
  ↓
Structured Officer Report                    [REAL orchestration output]
  ↓
Human Verification
  ↓
External Government System                   [FUTURE; mock submission today]
```

The React frontend never receives an OpenAI or Traffy secret. It calls the local server API:

- `POST /api/analyze` validates evidence and runs the full Concierge orchestration.
- `POST /api/submit` uses the mock submission provider by default.
- `GET /api/health` reports configuration state without revealing secrets.

## REAL / MOCK / FUTURE

### REAL

- OpenAI Responses API with strict JSON Schema output when `OPENAI_API_KEY` is configured.
- Server-side Zod validation.
- Explicit spatial, temporal, and normalized-observation semantic similarity.
- Deterministic urgency engine with visible factor contributions.
- Unified orchestration and officer-ready report preparation.
- Image MIME/size validation, API payload validation, timeouts, and size limits.

### MOCK

- Prachin Buri reports, factory distance, flood layer, incident history, and safety RAG source.
- The mock catalog contains 25 citizen reports: the fixed 8-report PB-024 water incident, a separate 3-report market-canal cluster, a 3-report roadside-smoke cluster, time-separated nearby evidence, and geographically unrelated reports. It also includes four factory records, three flood zones, four historical incidents, safety guidance, and a mock agency directory.
- Submission and tracking status.
- Deterministic evidence understanding if credentials are absent or OpenAI is unavailable.

### FUTURE INTEGRATION

- `TraffyProvider` and `TraffySubmissionProvider` intentionally contain no invented endpoints. A documented API, response mapper, credentials, and explicit authorization are required before live use.
- Context-provider interfaces can be replaced with government/open-data adapters without changing the orchestration layer.

## Deterministic logic

Clustering uses prototype assumptions: spatial `0.40`, temporal `0.30`, and normalized semantic overlap `0.30`. Environmental context does not change cluster membership; it is used separately by the urgency engine.

The urgency score is calculated in application code, not invented by an LLM. The seeded scenario returns `87/100`, high priority. These weights are prototype prioritization assumptions, not scientific contamination thresholds.

## Reproducible prototype evaluation

`evaluateDemoCluster()` measures the PB-024 binary cluster against labels for all 25 seeded reports. The test reports precision, recall, F1, true/false positives, and false negatives. This is a deterministic synthetic regression benchmark—not field validation or evidence of real-world model accuracy.

Run `npm test` to reproduce it. The same scope and metrics are visible to officers under **ระบบ AI** in Demo Mode.

## Competition demo path

1. Citizen submits evidence and receives `R-10824`.
2. Switch Demo Mode to Officer and open the priority incident.
3. Inspect the map/evidence, then accept the incident for review.
4. Review the AI-prepared report and explicitly forward it.

The Officer Console keeps this four-step path visible and does not perform autonomous submission.

## Configuration

```bash
cp .env.example .env
npm install
npm run dev
```

`OPENAI_API_KEY` and `OPENAI_MODEL` are server-only. Never create `VITE_OPENAI_API_KEY`. With `DEMO_MODE=true`, missing credentials and integration failures fall back to the deterministic scenario.

## Responsible AI

- AI may structure citizen-reported and visibly observable evidence.
- AI must not identify a chemical from an image.
- `chemical_identity` is validated as `unknown`.
- Results do not confirm contamination and always require field/laboratory verification.
- The model does not decide clustering or the urgency score.

## Verification

```bash
npm test
npm run build
```

## Deployment

Vercel serves the Vite frontend and the three `/api` endpoints as Functions under one domain. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for setup, environment variables, health checks, and the demo checklist.
