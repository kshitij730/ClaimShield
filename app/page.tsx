"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type EvidenceKey = "scene" | "damage" | "invoice";
type TabKey = "overview" | "intelligence" | "devsecops" | "forensics" | "network" | "report";

type DamageItem = {
  part: string;
  severity: number;
};

type InvoiceItem = {
  description: string;
  type: string;
  cost: number;
};

type SimilarCase = {
  case: string;
  similarity_score: number;
};

type ClaimResult = {
  fraud_score: number;
  inconsistencies: string[];
  linguistic_analysis: {
    score: number;
    indicators: string[];
  };
  image_forensics: Record<string, string>;
  risk_network: {
    claimant_id: string;
    known_associates_flag: boolean;
    garage_risk_score: number;
    historical_circle: string;
    risk_network_graph: string;
  };
  vehicle_intel: {
    vin: string;
    make: string;
    model: string;
    previous_accidents: number;
    salvage_history: string;
    owner_claim_frequency: string;
  };
  damage_analysis: DamageItem[];
  invoice_table: InvoiceItem[];
  report: string;
  similar_cases: SimilarCase[];
};

type DevSecOpsTool = {
  category: string;
  tools: string[];
  mode: "Integrated" | "Ready" | "Planned";
  outcome: string;
};

const evidenceLabels: Record<EvidenceKey, { title: string; hint: string; accept: string }> = {
  scene: {
    title: "Accident Scene",
    hint: "Road, junction, weather, skid marks",
    accept: "image/*",
  },
  damage: {
    title: "Vehicle Damage",
    hint: "Close-up damage image",
    accept: "image/*",
  },
  invoice: {
    title: "Repair Invoice",
    hint: "PDF or image invoice",
    accept: "image/*,.pdf",
  },
};

const tabs: { id: TabKey; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "intelligence", label: "AI Intel" },
  { id: "devsecops", label: "DevSecOps" },
  { id: "forensics", label: "Forensics" },
  { id: "network", label: "Network" },
  { id: "report", label: "Report" },
];

const devSecOpsStack: DevSecOpsTool[] = [
  {
    category: "Source Code Management",
    tools: ["GitHub", "GitLab", "Bitbucket"],
    mode: "Ready",
    outcome: "Branch strategy, protected review flow, signed-release checklist, and issue traceability.",
  },
  {
    category: "Infrastructure as Code",
    tools: ["Terraform", "AWS CloudFormation"],
    mode: "Planned",
    outcome: "Local IaC blueprint validation now; cloud apply intentionally disabled to avoid paid resources.",
  },
  {
    category: "Configuration Management",
    tools: ["Ansible", "Puppet", "Chef"],
    mode: "Ready",
    outcome: "Repeatable workstation, scanner, and API hardening playbooks for offline environments.",
  },
  {
    category: "CI/CD",
    tools: ["Jenkins", "GitHub Actions", "GitLab CI", "CircleCI"],
    mode: "Integrated",
    outcome: "Build, lint, dependency scan, SAST, container scan, SBOM, and release evidence gates.",
  },
  {
    category: "Containerization & Orchestration",
    tools: ["Docker", "Kubernetes", "Helm", "Argo CD"],
    mode: "Ready",
    outcome: "Container-first backend with GitOps delivery model prepared for local clusters and later cloud.",
  },
  {
    category: "SAST",
    tools: ["SonarQube", "Checkmarx"],
    mode: "Ready",
    outcome: "Code quality, injection risk, insecure defaults, and maintainability gates.",
  },
  {
    category: "Dependency & Vulnerability Scanning",
    tools: ["OWASP Dependency-Check", "Trivy", "Snyk", "Clair"],
    mode: "Integrated",
    outcome: "Frontend, Python, and container dependency risk checks with severity scoring.",
  },
  {
    category: "DAST",
    tools: ["OWASP ZAP", "Burp Suite"],
    mode: "Ready",
    outcome: "Authenticated API and browser-route probing plan for the local FastAPI and Next.js apps.",
  },
  {
    category: "Secret Management",
    tools: ["HashiCorp Vault", "AWS Secrets Manager"],
    mode: "Ready",
    outcome: "Vault/local dotenv contract now; AWS Secrets Manager adapter deferred until budget is approved.",
  },
  {
    category: "Security Policy & Compliance",
    tools: ["Open Policy Agent", "HashiCorp Sentinel"],
    mode: "Integrated",
    outcome: "Policy-as-code guardrails for Dockerfiles, public CORS, exposed secrets, and IaC drift.",
  },
  {
    category: "Monitoring & Logging",
    tools: ["Prometheus", "Grafana", "ELK Stack"],
    mode: "Ready",
    outcome: "Metrics, audit trail, claim-risk events, and investigation logs ready for local observability.",
  },
  {
    category: "Cloud Security Tools",
    tools: ["AWS Config", "Azure Security Center", "Google Cloud SCC"],
    mode: "Planned",
    outcome: "Mapped as future controls only; no paid cloud activation in this version.",
  },
];

const mockResult: ClaimResult = {
  fraud_score: 0.86,
  inconsistencies: [
    "Damage severity is higher than collision geometry indicates.",
    "Invoice includes bumper replacement while visual model detects only surface abrasion.",
    "Claim narrative contains repeated certainty phrases and low sensory detail.",
  ],
  linguistic_analysis: {
    score: 0.62,
    indicators: [
      "Repeated credibility boosters: honestly, guarantee, truthfully.",
      "Narrative avoids clear impact sequence and post-incident actions.",
      "High emotional certainty with low physical detail density.",
    ],
  },
  image_forensics: {
    metadata_consistency: "FAIL",
    exif_location: "3.2 miles away from reported scene",
    timestamp_match: "Mismatch: captured four days after reported incident",
    digital_alteration_detected: "Minor brightness and contrast manipulation",
    camera_model: "iPhone 15 Pro",
  },
  risk_network: {
    claimant_id: "CL-88219",
    known_associates_flag: true,
    garage_risk_score: 0.82,
    historical_circle: "Associated with two prior staged accident clusters",
    risk_network_graph: "Cluster NC-2201 detected",
  },
  vehicle_intel: {
    vin: "1FA6P8CF5H5XXXXXX",
    make: "Ford",
    model: "F-150",
    previous_accidents: 2,
    salvage_history: "None",
    owner_claim_frequency: "High: 3 claims in 24 months",
  },
  damage_analysis: [
    { part: "Front bumper", severity: 0.74 },
    { part: "Left fender", severity: 0.48 },
    { part: "Headlamp", severity: 0.36 },
  ],
  invoice_table: [
    { description: "Front bumper assembly", type: "Body", cost: 1260 },
    { description: "Paint blend and labor", type: "Labor", cost: 860 },
    { description: "Diagnostic calibration", type: "ADAS", cost: 420 },
  ],
  similar_cases: [
    {
      case: "High invoice delta after low-speed side-swipe with repeated certainty language.",
      similarity_score: 0.91,
    },
    {
      case: "Repair facility previously appeared in clustered staged-collision claims.",
      similarity_score: 0.84,
    },
  ],
  report: `# ClaimShield Autonomous Investigation Report

## Verdict
The claim should be routed to special investigation review. The system found multimodal inconsistencies across visual damage, invoice charges, linguistic signals, EXIF metadata, and network risk.

## Key Findings
| Signal | Assessment |
| --- | --- |
| Fraud probability | 86% |
| Visual-invoice consistency | Weak |
| Metadata trust | Failed |
| Network risk | Elevated |

## Next Actions
1. Request original image files with unmodified EXIF metadata.
2. Validate repair invoice line items against an independent estimator.
3. Review claimant and garage relationship history before payout.`,
};

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export default function ClaimShieldDashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [statusMessage, setStatusMessage] = useState("Local-first investigation mode is ready.");
  const [description, setDescription] = useState(
    "I honestly believe this accident was not my fault. The other car came out of nowhere and I guarantee it happened quickly.",
  );
  const [files, setFiles] = useState<Record<EvidenceKey, File | null>>({
    scene: null,
    damage: null,
    invoice: null,
  });

  const uploadedCount = useMemo(() => Object.values(files).filter(Boolean).length, [files]);
  const riskLevel = result && result.fraud_score > 0.75 ? "Critical" : result && result.fraud_score > 0.55 ? "Elevated" : "Normal";
  const anomalies = result
    ? result.inconsistencies.length + result.linguistic_analysis.indicators.length
    : 0;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, type: EvidenceKey) => {
    setFiles((current) => ({ ...current, [type]: event.target.files?.[0] ?? null }));
  };

  const runInvestigation = async () => {
    const hasAllFiles = Object.values(files).every(Boolean);
    if (!hasAllFiles) {
      setStatusMessage("Demo intelligence loaded. Upload all evidence files to call the FastAPI engine.");
      setResult(mockResult);
      setActiveTab("overview");
      return;
    }

    setLoading(true);
    setStatusMessage("Analyzing evidence across vision, OCR, reasoning, and risk engines...");

    const formData = new FormData();
    formData.append("scene_image", files.scene as File);
    formData.append("damage_image", files.damage as File);
    formData.append("invoice_doc", files.invoice as File);
    formData.append("description", description);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    try {
      const response = await fetch(`${apiBaseUrl}/analyze_claim`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = (await response.json()) as ClaimResult;
      setResult(data);
      setStatusMessage("Live backend investigation completed.");
    } catch (error) {
      console.error("Analysis failed", error);
      setResult(mockResult);
      setStatusMessage("Backend was not reachable, so a high-fidelity demo investigation is displayed.");
    } finally {
      setLoading(false);
      setActiveTab("overview");
    }
  };

  return (
    <main className="shell">
      <section className="hero-panel">
        <div className="brand-row">
          <div className="brand-mark">CS</div>
          <div>
            <p className="eyebrow">ClaimShield XDR for Insurance Fraud</p>
            <h1>Autonomous multimodal fraud command center</h1>
          </div>
        </div>
        <p className="hero-copy">
          Vision AI, OCR, linguistic deception signals, forensic metadata, graph intelligence,
          and DevSecOps controls in one local-first investigation cockpit.
        </p>
        <div className="hero-metrics">
          <div>
            <span>{uploadedCount}/3</span>
            <p>Evidence files</p>
          </div>
          <div>
            <span>{result ? formatPercent(result.fraud_score) : "Ready"}</span>
            <p>Fraud probability</p>
          </div>
          <div>
            <span>{result ? riskLevel : "Local"}</span>
            <p>Cloud-free mode</p>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="control-panel">
          <div className="panel-heading">
            <p className="eyebrow">Evidence Intake</p>
            <h2>Case builder</h2>
          </div>

          <div className="upload-stack">
            {(Object.keys(evidenceLabels) as EvidenceKey[]).map((key) => (
              <label className="upload-tile" key={key}>
                <span>{evidenceLabels[key].title}</span>
                <small>{files[key]?.name ?? evidenceLabels[key].hint}</small>
                <input
                  type="file"
                  accept={evidenceLabels[key].accept}
                  onChange={(event) => handleFileChange(event, key)}
                />
              </label>
            ))}
          </div>

          <label className="narrative-box">
            <span>Claim Narrative</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>

          <button className="primary-action" onClick={runInvestigation} disabled={loading}>
            {loading ? "Running investigation..." : uploadedCount === 3 ? "Run live investigation" : "Launch demo intelligence"}
          </button>

          <p className="status-line">{statusMessage}</p>

          <nav className="tab-list" aria-label="Investigation sections">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="content-panel">
          {!result ? (
            <EmptyState />
          ) : (
            <>
              <div className="risk-strip">
                <div>
                  <p className="eyebrow">Fraud Probability Index</p>
                  <strong>{formatPercent(result.fraud_score)}</strong>
                </div>
                <div>
                  <p className="eyebrow">Risk Level</p>
                  <strong>{riskLevel}</strong>
                </div>
                <div>
                  <p className="eyebrow">Anomalies</p>
                  <strong>{anomalies}</strong>
                </div>
                <div>
                  <p className="eyebrow">Investigation Mode</p>
                  <strong>Human-in-loop</strong>
                </div>
              </div>

              {activeTab === "overview" && <OverviewTab result={result} />}
              {activeTab === "intelligence" && <IntelligenceTab result={result} />}
              {activeTab === "devsecops" && <DevSecOpsTab />}
              {activeTab === "forensics" && <ForensicsTab result={result} />}
              {activeTab === "network" && <NetworkTab result={result} />}
              {activeTab === "report" && <ReportTab report={result.report} />}
            </>
          )}
        </section>
      </section>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="radar">
        <span />
        <span />
        <span />
      </div>
      <p className="eyebrow">Ready for forensic analysis</p>
      <h2>Upload evidence or launch the built-in demo intelligence.</h2>
      <p>
        The cockpit is wired for live FastAPI analysis, but remains useful offline with a realistic
        investigation dataset.
      </p>
    </div>
  );
}

function OverviewTab({ result }: { result: ClaimResult }) {
  return (
    <div className="dashboard-grid">
      <article className="surface">
        <h3>Critical inconsistencies</h3>
        <div className="signal-list">
          {result.inconsistencies.map((item) => (
            <div className="signal high" key={item}>{item}</div>
          ))}
        </div>
      </article>

      <article className="surface">
        <h3>Visual damage matrix</h3>
        <div className="damage-grid">
          {result.damage_analysis.map((item) => (
            <div key={item.part}>
              <span>{item.part}</span>
              <strong>{formatPercent(item.severity)}</strong>
              <div className="meter"><i style={{ width: formatPercent(item.severity) }} /></div>
            </div>
          ))}
        </div>
      </article>

      <article className="surface wide">
        <h3>Financial audit breakdown</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Class</th>
                <th>Claimed</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {result.invoice_table.map((item) => (
                <tr key={`${item.description}-${item.cost}`}>
                  <td>{item.description}</td>
                  <td>{item.type}</td>
                  <td>${item.cost.toFixed(2)}</td>
                  <td><span className="pill amber">Needs review</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}

function IntelligenceTab({ result }: { result: ClaimResult }) {
  return (
    <div className="dashboard-grid">
      <article className="surface">
        <h3>Linguistic deception analysis</h3>
        <div className="large-number">{formatPercent(result.linguistic_analysis.score)}</div>
        <div className="signal-list">
          {result.linguistic_analysis.indicators.map((indicator) => (
            <div className="signal amber" key={indicator}>{indicator}</div>
          ))}
        </div>
      </article>

      <article className="surface">
        <h3>Vehicle intelligence</h3>
        <dl className="facts">
          <div><dt>VIN</dt><dd>{result.vehicle_intel.vin}</dd></div>
          <div><dt>Vehicle</dt><dd>{result.vehicle_intel.make} {result.vehicle_intel.model}</dd></div>
          <div><dt>Previous accidents</dt><dd>{result.vehicle_intel.previous_accidents}</dd></div>
          <div><dt>Claim frequency</dt><dd>{result.vehicle_intel.owner_claim_frequency}</dd></div>
        </dl>
      </article>

      <article className="surface wide">
        <h3>Similar suspicious patterns</h3>
        <div className="pattern-grid">
          {result.similar_cases.map((similarCase) => (
            <div className="pattern-card" key={similarCase.case}>
              <strong>{formatPercent(similarCase.similarity_score)} match</strong>
              <p>{similarCase.case}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

function DevSecOpsTab() {
  const integrated = devSecOpsStack.filter((item) => item.mode === "Integrated").length;
  return (
    <div className="dashboard-grid">
      <article className="surface wide">
        <div className="section-head">
          <div>
            <p className="eyebrow">Cloud spend disabled</p>
            <h3>Local-first DevSecOps control plane</h3>
          </div>
          <span className="pill green">{integrated} active gates</span>
        </div>
        <div className="devsecops-grid">
          {devSecOpsStack.map((item) => (
            <div className="tool-card" key={item.category}>
              <div>
                <span className={`mode ${item.mode.toLowerCase()}`}>{item.mode}</span>
                <h4>{item.category}</h4>
              </div>
              <p>{item.outcome}</p>
              <div className="tool-chips">
                {item.tools.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

function ForensicsTab({ result }: { result: ClaimResult }) {
  return (
    <div className="dashboard-grid">
      <article className="surface">
        <h3>Image EXIF metadata verification</h3>
        <dl className="facts">
          {Object.entries(result.image_forensics).map(([key, value]) => (
            <div key={key}>
              <dt>{key.replace(/_/g, " ")}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </article>

      <article className="surface">
        <h3>Evidence integrity score</h3>
        <div className="integrity-ring">
          <span>42%</span>
        </div>
        <p className="muted">
          Metadata and capture timeline need manual validation before approving payout.
        </p>
      </article>
    </div>
  );
}

function NetworkTab({ result }: { result: ClaimResult }) {
  return (
    <div className="dashboard-grid">
      <article className="surface wide">
        <h3>Fraud network analysis</h3>
        <div className="network-layout">
          <div className="network-map" aria-label="Risk network graph">
            <span className="node subject">Claimant</span>
            <span className="node shop">Repair shop</span>
            <span className="node vin">VIN</span>
            <span className="node case">Prior case</span>
          </div>
          <dl className="facts">
            <div><dt>Claimant ID</dt><dd>{result.risk_network.claimant_id}</dd></div>
            <div><dt>Known associates</dt><dd>{result.risk_network.known_associates_flag ? "Flagged" : "Clear"}</dd></div>
            <div><dt>Garage risk</dt><dd>{formatPercent(result.risk_network.garage_risk_score)}</dd></div>
            <div><dt>Cluster</dt><dd>{result.risk_network.risk_network_graph}</dd></div>
            <div><dt>Historical link</dt><dd>{result.risk_network.historical_circle}</dd></div>
          </dl>
        </div>
      </article>
    </div>
  );
}

function ReportTab({ report }: { report: string }) {
  return (
    <article className="surface markdown-report">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
    </article>
  );
}
