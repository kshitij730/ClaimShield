# ClaimShield

![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![DevSecOps](https://img.shields.io/badge/DevSecOps-Local_First-2ea44f?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Multimodal_Forensics-6f42c1?style=for-the-badge)

ClaimShield is a multimodal forensic fraud investigation platform for insurance claims. It turns accident-scene images, vehicle damage photos, repair invoices, claim narratives, metadata, historical patterns, and security controls into a single investigation command center.

The project is designed to look and behave like a serious AI + DevSecOps product while staying local-first. Cloud security adapters are mapped for future expansion, but paid cloud resource creation is intentionally disabled.

## Highlights

- Autonomous investigation cockpit with a polished, responsive Next.js UI.
- Vehicle damage, accident-scene, invoice, narrative, EXIF, and network-risk analysis.
- Live FastAPI integration plus a built-in high-fidelity demo mode when the backend is unavailable.
- Fraud probability index, anomaly timeline, financial audit table, metadata integrity view, graph-risk panel, and markdown report view.
- DevSecOps control plane covering SCM, IaC, CI/CD, containers, SAST, DAST, dependency scanning, secrets, policy, compliance, monitoring, and logging.
- No paid cloud dependency required for local development or evaluation.

## Product Preview

The first screen is the actual investigation workspace, not a marketing page. Analysts can upload:

- Accident scene image
- Vehicle damage image
- Repair invoice PDF/image
- Claim narrative text

If all evidence is provided, ClaimShield calls the FastAPI reasoning engine. If the backend is not running, the UI automatically falls back to a realistic demo investigation so reviewers can still experience the full product flow.

## Core AI Modules

| Module | Purpose |
| --- | --- |
| Vision AI | Detects damaged vehicle parts and estimates damage severity. |
| OCR Intelligence | Extracts invoice line items and repair cost structures. |
| Reasoning Engine | Checks physical, financial, and narrative consistency. |
| Linguistic Analysis | Flags credibility boosters, vague timelines, and low-detail narratives. |
| Similar Case Retrieval | Compares the claim against historical suspicious patterns. |
| EXIF Forensics | Reviews metadata, timestamp, camera, and location consistency. |
| Network Risk | Connects claimant, VIN, repair shop, and prior suspicious clusters. |
| Report Generation | Produces a structured SIU-style investigation report in Markdown. |

## DevSecOps Coverage

| Area | Tools And Controls |
| --- | --- |
| Source Code Management | GitHub, GitLab, Bitbucket patterns for branches, reviews, and traceability. |
| Infrastructure as Code | Terraform and AWS CloudFormation no-spend references. |
| Configuration Management | Ansible local hardening playbook; Puppet and Chef workflow compatibility. |
| CI/CD | GitHub Actions workflow with patterns portable to Jenkins, GitLab CI, and CircleCI. |
| Containers & GitOps | Docker backend, Kubernetes/Helm/Argo CD-ready deployment model. |
| SAST | CodeQL, SonarQube config, Checkmarx-ready quality gates. |
| Dependency Scanning | Trivy, OWASP Dependency-Check, Snyk config, Clair-ready container scanning. |
| DAST | OWASP ZAP baseline config and Burp Suite manual testing workflow. |
| Secret Management | Local `.env` contract, HashiCorp Vault-ready pattern, AWS Secrets Manager future adapter. |
| Policy & Compliance | Open Policy Agent policies and HashiCorp Sentinel-ready IaC guardrails. |
| Monitoring & Logging | Prometheus metrics, Grafana datasource, ELK ingestion pipeline. |
| Cloud Security | AWS Config, Azure Security Center, and Google Cloud SCC mapped for later only. |

## Architecture

```text
ClaimShield
  app/                         Next.js investigation command center
  backend/app/                 FastAPI multimodal reasoning API
  .github/workflows/           CI/CD and DevSecOps gates
  security/opa/                OPA policy-as-code checks
  security/zap/                OWASP ZAP baseline config
  security/ansible/            Local hardening playbook
  observability/prometheus/    Prometheus scrape config
  observability/grafana/       Grafana datasource provisioning
  observability/logstash/      ELK ingestion pipeline
  iac/terraform/               No-spend Terraform reference
  iac/cloudformation/          No-spend CloudFormation reference
  docker-compose.security.yml  Local security and observability stack
```

## Backend API

| Endpoint | Description |
| --- | --- |
| `GET /health` | Service status, version, model-load state, and cloud-spend flag. |
| `GET /metrics` | Prometheus-compatible local metrics. |
| `GET /devsecops` | DevSecOps control inventory exposed for dashboards and audits. |
| `POST /analyze_claim` | Runs multimodal claim investigation from uploaded evidence. |

## Local Setup

### 1. Frontend

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Optional environment variable:

```bash
GROQ_API_KEY=your_key_here
```

Without a live LLM key, the app can still run with fallback/demo investigation output.

## Local Security And Observability

Start local observability:

```bash
docker compose -f docker-compose.security.yml up prometheus grafana elasticsearch logstash kibana
```

Run vulnerability scans:

```bash
docker compose -f docker-compose.security.yml --profile scan run --rm trivy
docker compose -f docker-compose.security.yml --profile scan run --rm dependency-check
```

Run DAST baseline after starting the frontend:

```bash
docker compose -f docker-compose.security.yml --profile dast run --rm zap
```

Useful local URLs:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8000` |
| API Docs | `http://localhost:8000/docs` |
| Prometheus | `http://localhost:9090` |
| Grafana | `http://localhost:3001` |
| Kibana | `http://localhost:5601` |

## Verification

```bash
npm run lint
npm run build
python -m compileall backend
```

The repository also includes `.github/workflows/devsecops.yml` for CI checks covering frontend build, backend syntax, SAST, policy checks, secret scanning, dependency scanning, and container scanning.

## No-Paid-Cloud Policy

This project intentionally avoids creating paid cloud resources. Terraform and CloudFormation files are references for future enterprise deployment only. Cloud security tools such as AWS Config, Azure Security Center, and Google Cloud Security Command Center are mapped as planned adapters, not activated services.

## Roadmap

- Add persistent case history and analyst notes.
- Add real VIN, repair-estimate, and policy data connectors.
- Add authenticated analyst workspaces.
- Add Kubernetes manifests and Helm chart for local clusters.
- Add Grafana dashboards for claim-risk trends and API health.
- Add SIU PDF export and evidence bundle generation.

## Author

Built by Kshitij Sharma as an advanced AI, fraud analytics, and DevSecOps showcase project.
