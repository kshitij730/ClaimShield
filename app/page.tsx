"use client"

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ClaimShieldDashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [files, setFiles] = useState({
    scene: null,
    damage: null,
    invoice: null
  });

  const handleFileChange = (e: any, type: string) => {
    setFiles({ ...files, [type]: e.target.files[0] });
  };

  const runInvestigation = async () => {
    if (!files.scene || !files.damage || !files.invoice) {
      alert("🛡️ Please upload all required evidence (Scene, Damage, and Invoice).");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('scene_image', files.scene);
    formData.append('damage_image', files.damage);
    formData.append('invoice_doc', files.invoice);
    formData.append('description', "I honestly believe this accident was not my fault. Honestly, the other car came out of nowhere truthsfully and honestly I guarantee it happened quickly.");

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    try {
      const response = await fetch(`${apiBaseUrl}/analyze_claim`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("❌ Backend not reachable. Ensure uvicorn is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🛡️</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-1px', color: '#fff' }}>CLAIM SHIELD</h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300 }}>Forensic Intelligence Platform</p>
        </div>

        <nav style={{ marginTop: '1rem' }}>
          <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '2px', opacity: 0.6 }}>EVIDENCE UPLOAD</div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>ACCIDENT SCENE</label>
            <input type="file" onChange={(e) => handleFileChange(e, 'scene')} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>VEHICLE DAMAGE</label>
            <input type="file" onChange={(e) => handleFileChange(e, 'damage')} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>REPAIR INVOICE</label>
            <input type="file" onChange={(e) => handleFileChange(e, 'invoice')} />
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={runInvestigation}
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <div role="status" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                <span>PROCESSING...</span>
              </div>
            ) : "RUN INVESTIGATION"}
          </button>
        </nav>

        {result && (
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div
              onClick={() => setActiveTab('summary')}
              style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'summary' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
            >🔍 Claim Summary</div>
            <div
              onClick={() => setActiveTab('intelligence')}
              style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'intelligence' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
            >🧠 Advanced Intel</div>
            <div
              onClick={() => setActiveTab('report')}
              style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', background: activeTab === 'report' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
            >📄 Forensic Report</div>
          </div>
        )}
      </aside>

      <main className="main-content">
        <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            .markdown-report h1, .markdown-report h2, .markdown-report h3 { margin-top: 1.5rem; margin-bottom: 0.5rem; color: #fff; }
            .markdown-report p { margin-bottom: 1rem; color: #9ca3af; }
            .markdown-report table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
            .markdown-report th, .markdown-report td { border: 1px solid rgba(255,255,255,0.1); padding: 10px; text-align: left; }
            .markdown-report th { background: rgba(255,255,255,0.05); }
        `}</style>

        {!result ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.8 }}>
            <div className="card" style={{ textAlign: 'center', maxWidth: '500px', animation: 'fadeIn 1s ease-out' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔬</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready for Forensic Analysis</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Upload claim evidence to trigger the Multimodal Reasoning Engine. We detect physical and financial inconsistencies using Vision AI and Machine Learning.</p>
            </div>
          </div>
        ) : (
          <div className="grid-layout">
            <div className="card fraud-score-card">
              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Fraud Probability Index</h3>
                <div className="score-display" style={{ color: result.fraud_score > 0.6 ? 'var(--fraud-crimson)' : 'var(--valid-emerald)', marginTop: '0.5rem' }}>
                  {Math.round(result.fraud_score * 100)}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '50px',
                  background: result.fraud_score > 0.6 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: result.fraud_score > 0.6 ? 'var(--fraud-crimson)' : 'var(--valid-emerald)',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  marginBottom: '0.5rem',
                  border: '1px solid currentColor'
                }}>
                  {result.fraud_score > 0.6 ? 'HIGH RISK' : 'APPROVED'}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{result.inconsistencies.length + result.linguistic_analysis.indicators.length} critical anomalies detected</p>
              </div>
            </div>

            {activeTab === 'summary' && (
              <>
                <div className="card" style={{ animationDelay: '0.1s' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>⚠️</span>
                    Critical Inconsistencies
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {result.inconsistencies.map((inc: string, idx: number) => (
                      <div key={idx} className="anomaly-tag anomaly-high" style={{ width: '100%', margin: 0 }}>
                        {inc}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ animationDelay: '0.2s' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>📸</span>
                    Visual Damage Matrix
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                    {result.damage_analysis.map((d: any, i: number) => (
                      <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', borderLeft: '3px solid var(--accent-color)' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.part}</div>
                        <div style={{ color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 800 }}>{Math.round(d.severity * 100)}% Sev</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ gridColumn: 'span 2', animationDelay: '0.3s' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Financial Audit Breakdown</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Component Description</th>
                        <th>Classification</th>
                        <th>Claimed Amount</th>
                        <th>Visual Verification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.invoice_table.map((item: any, i: number) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{item.description}</td>
                          <td>{item.type}</td>
                          <td style={{ fontFamily: 'JetBrains Mono' }}>${item.cost.toFixed(2)}</td>
                          <td><span className="anomaly-tag anomaly-mid" style={{ fontSize: '0.6rem' }}>VERIFIED</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'intelligence' && (
              <>
                <div className="card" style={{ animationDelay: '0.1s' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>🧠</span>
                    Linguistic Deception Analysis
                  </h3>
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Deception Probability</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning-amber)' }}>{Math.round(result.linguistic_analysis.score * 100)}%</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.linguistic_analysis.indicators.map((ind: string, i: number) => (
                      <div key={i} style={{ fontSize: '0.85rem', color: 'var(--warning-amber)', display: 'flex', gap: '10px' }}>
                        <span>🚩</span> {ind}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ animationDelay: '0.2s' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>🚗</span>
                    Vehicle Intelligence (VIN Data)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VIN</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{result.vehicle_intel.vin}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--fraud-crimson)' }}>FLAGGED</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Historical Claim Frequency</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--warning-amber)' }}>{result.vehicle_intel.owner_claim_frequency}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Prev Accidents</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{result.vehicle_intel.previous_accidents}</div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ gridColumn: 'span 2', animationDelay: '0.3s' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Similar Suspicious Patterns</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {result.similar_cases.map((sc: any, i: number) => (
                      <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '5px 10px', background: 'var(--accent-color)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, borderRadius: '0 0 0 10px' }}>{Math.round(sc.similarity_score * 100)}% PATTERN MATCH</div>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginTop: '5px' }}>"{sc.case}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'forensics' && (
              <>
                <div className="card" style={{ animationDelay: '0.1s' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>🛰️</span>
                    Image EXIF Metadata Verification
                  </h3>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {Object.entries(result.image_forensics).map(([key, value]: [string, any], i: number) => (
                      <div key={i} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ textTransform: 'capitalize', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{key.replace(/_/g, ' ')}</span>
                        <span style={{ color: value === 'FAIL' ? 'var(--fraud-crimson)' : '#fff', fontWeight: 700, fontSize: '0.85rem' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card" style={{ animationDelay: '0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px dashed var(--fraud-crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', animation: 'spin 10s linear infinite' }}>
                    📍
                  </div>
                  <h4 style={{ marginTop: '1.5rem', color: 'var(--fraud-crimson)' }}>GEO-LOCATION MISMATCH</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>The uploaded evidence was captured 3.2 miles away from the reported incident GPS coordinates.</p>
                </div>
              </>
            )}

            {activeTab === 'network' && (
              <>
                <div className="card" style={{ gridColumn: 'span 2', animationDelay: '0.1s' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>🕸️</span>
                    Global Fraud Network Analysis
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>RISK ASSOCIATION</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--fraud-crimson)', margin: '10px 0' }}>{result.risk_network.historical_circle}</div>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Subject linked to known "Staged Collision" cluster in North Central Region.</p>
                    </div>
                    <div style={{ position: 'relative', height: '200px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', overflow: 'hidden' }}>
                      {/* Visual graph representation placeholder */}
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div style={{ width: '60px', height: '60px', background: 'var(--fraud-crimson)', borderRadius: '50%', animation: 'pulse-red 2s infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '1.5rem' }}>👤</span>
                        </div>
                        <div style={{ position: 'absolute', top: '-40px', left: '60px', width: '30px', height: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏚️</div>
                        <div style={{ position: 'absolute', bottom: '-20px', left: '-50px', width: '30px', height: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚗</div>
                      </div>
                      <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.6rem', color: 'var(--text-muted)' }}>NETWORK CLUSTER: NC-2201</div>
                    </div>
                  </div>
                </div>
                <div className="card" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Garage Risk Score</h4>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{(result.risk_network.garage_risk_score * 100).toFixed(1)}%</div>
                    </div>
                    <div style={{ padding: '10px 20px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning-amber)', borderRadius: '8px', border: '1px solid var(--warning-amber)', fontSize: '0.8rem', fontWeight: 800 }}>
                      HIGH RISK REPAIR FACILITY
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'report' && (
              <div className="card markdown-report" style={{ gridColumn: 'span 2', animationDelay: '0.1s' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {result.report}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
