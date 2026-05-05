import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, ReferenceLine, Legend } from "recharts";

// ─── BRAND TOKENS ───
const C = {
  purple: "#8039DF",
  purpleDark: "#3E0075",
  purpleLight: "#F5EDFF",
  pink: "#FF2370",
  white: "#FFFFFF",
  offWhite: "#FAFAFA",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
  green: "#16A34A",
  greenLight: "#DCFCE7",
  red: "#DC2626",
  redLight: "#FEE2E2",
};

// ─── DATA ───
const rampData = [
  { tier: "Tier 1", label: "Lowest", days: 44.5, n: 62 },
  { tier: "Tier 2", label: "", days: 43.0, n: 61 },
  { tier: "Tier 3", label: "", days: 33.5, n: 62 },
  { tier: "Tier 4", label: "Highest", days: 30.0, n: 61 },
];

const revenueData = [
  { tier: "Tier 1", label: "Lowest", delta: -9857, n: 250 },
  { tier: "Tier 2", label: "", delta: -5168, n: 250 },
  { tier: "Tier 3", label: "", delta: 1269, n: 250 },
  { tier: "Tier 4", label: "Highest", delta: 5580, n: 250 },
];

const pitchData = [
  { quartile: "Q1", share: "~35%", delta: -9525 },
  { quartile: "Q2", share: "~48%", delta: -5855 },
  { quartile: "Q3", share: "~55%", delta: 2196 },
  { quartile: "Q4", share: "~65%", delta: 5300 },
];

const correlationData = [
  { feature: "Manager call coaching", r: -0.44, p: "<0.001" },
  { feature: "Deal board access", r: -0.42, p: "<0.001" },
  { feature: "Overall engagement index", r: -0.40, p: "<0.001" },
  { feature: "Peer call listening", r: -0.24, p: "<0.001" },
];

const scenarioData = [
  { scenario: "Conservative", pctTop: "40%", topReps: "2,000", bottomReps: "3,000" },
  { scenario: "Base", pctTop: "50%", topReps: "2,500", bottomReps: "2,500" },
  { scenario: "Optimistic", pctTop: "65%", topReps: "3,250", bottomReps: "1,750" },
];

// ─── COMPONENTS ───
const font = `"Söhne", "Helvetica Neue", -apple-system, sans-serif`;
const monoFont = `"SF Mono", "Fira Code", "Consolas", monospace`;

function SlideNav({ current, total, onNav }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: C.gray900, borderTop: `1px solid ${C.gray700}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 24px", fontFamily: font,
    }}>
      <span style={{ color: C.gray400, fontSize: 13 }}>
        Lauren Jackson — Gong Value Insights Exercise
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {Array.from({ length: total }, (_, i) => (
          <button key={i} onClick={() => onNav(i)} style={{
            width: i === current ? 28 : 8, height: 8, borderRadius: 4,
            background: i === current ? C.purple : C.gray600,
            border: "none", cursor: "pointer", transition: "all 0.3s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onNav(Math.max(0, current - 1))} disabled={current === 0}
          style={{ background: "none", border: `1px solid ${C.gray600}`, color: C.gray300, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: font, opacity: current === 0 ? 0.3 : 1 }}>
          Prev
        </button>
        <button onClick={() => onNav(Math.min(total - 1, current + 1))} disabled={current === total - 1}
          style={{ background: C.purple, border: "none", color: C.white, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: font, opacity: current === total - 1 ? 0.3 : 1 }}>
          Next
        </button>
      </div>
    </div>
  );
}

function Stat({ value, label, accent = false }) {
  return (
    <div style={{
      background: accent ? C.purpleLight : C.white,
      border: `1px solid ${accent ? C.purple + "30" : C.gray200}`,
      borderRadius: 12, padding: "24px 28px", flex: 1, minWidth: 200,
    }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: accent ? C.purple : C.gray900, fontFamily: font, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 14, color: C.gray500, marginTop: 6, fontFamily: font, lineHeight: 1.4 }}>
        {label}
      </div>
    </div>
  );
}

function DataTable({ headers, rows, highlightCol = -1 }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font, fontSize: 14 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: i === 0 ? "left" : "right", padding: "10px 14px",
                borderBottom: `2px solid ${C.gray200}`, color: C.gray500,
                fontSize: 12, fontWeight: 600, letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? C.white : C.gray50 }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  textAlign: ci === 0 ? "left" : "right", padding: "11px 14px",
                  borderBottom: `1px solid ${C.gray100}`,
                  color: ci === highlightCol ? (cell.startsWith("+") || cell.startsWith("$") ? C.green : cell.startsWith("-") ? C.red : C.gray800) : C.gray800,
                  fontWeight: ci === highlightCol ? 600 : 400,
                  fontFamily: ci > 0 ? monoFont : font,
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
      color: C.purple, fontFamily: font, marginBottom: 8,
    }}>{text}</div>
  );
}

function Callout({ children, type = "insight" }) {
  const colors = {
    insight: { bg: C.purpleLight, border: C.purple + "40", icon: "💡" },
    action: { bg: C.greenLight, border: C.green + "40", icon: "→" },
    caveat: { bg: C.gray100, border: C.gray300, icon: "⚠" },
  };
  const c = colors[type];
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10,
      padding: "16px 20px", fontSize: 14, color: C.gray800, fontFamily: font,
      lineHeight: 1.6, display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{c.icon}</span>
      <div>{children}</div>
    </div>
  );
}

// ─── SLIDES ───
function TitleSlide() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      background: `linear-gradient(145deg, ${C.purpleDark} 0%, ${C.purple} 50%, #A855F7 100%)`,
      padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -100, right: -100, width: 400, height: 400,
        borderRadius: "50%", background: "rgba(255,255,255,0.04)",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 300, height: 300,
        borderRadius: "50%", background: "rgba(255,255,255,0.03)",
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
        <div style={{
          fontSize: 13, letterSpacing: "3px", color: "rgba(255,255,255,0.6)",
          fontFamily: font, fontWeight: 600, marginBottom: 24, textTransform: "uppercase",
        }}>Value Insights Assessment</div>
        <h1 style={{
          fontFamily: font, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800,
          color: C.white, lineHeight: 1.1, margin: 0,
        }}>
          RavingFan Inc.
        </h1>
        <h2 style={{
          fontFamily: font, fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 400,
          color: "rgba(255,255,255,0.8)", lineHeight: 1.3, margin: "16px 0 0",
        }}>
          Quantifying the Impact of Gong's<br />Canada Deployment
        </h2>
        <div style={{
          width: 60, height: 3, background: C.pink, borderRadius: 2,
          margin: "40px auto 40px",
        }} />
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, fontFamily: font }}>
          Prepared by Lauren Jackson
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: font, marginTop: 6 }}>
          1,000-rep deployment analysis with global rollout projection
        </div>
      </div>
    </div>
  );
}

function ExecSummarySlide() {
  return (
    <div style={{ minHeight: "100vh", background: C.white, padding: "80px 40px 120px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <SectionLabel text="1 — Executive Summary" />
        <h2 style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.gray900, margin: "0 0 12px", lineHeight: 1.15 }}>
          Executive Summary
        </h2>
        <p style={{ fontFamily: font, fontSize: 17, color: C.gray500, margin: "0 0 36px", lineHeight: 1.5 }}>
          Key findings from RavingFan's 3-month Gong deployment across 1,000 sales reps in the Canada sales center.
        </p>

        <Callout type="action">
          <strong>Recommendation: Proceed with global rollout.</strong> Gong adoption is strongly correlated with faster new hire onboarding and higher per-rep revenue across every metric tested. The signal is consistent, monotonic across adoption tiers, and robust to alternative metric definitions.
        </Callout>

        <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
          <Stat value="14.5 days" label="Faster ramp for top-tier new hires vs bottom-tier" accent />
          <Stat value="$15.4K" label="Quarterly per-rep revenue gap between top and bottom adoption tiers" accent />
          <Stat value="3 scenarios" label="Projection model for 5,000-rep global rollout" />
        </div>

        <h3 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.gray800, margin: "40px 0 16px" }}>
          Findings at a Glance
        </h3>
        <DataTable
          headers={["Finding", "Metric", "Impact"]}
          rows={[
            ["Faster new hire ramp", "Median days to first deal", "30 days (top tier) vs 44.5 days (bottom tier)"],
            ["Higher revenue per rep", "Q3→Q4 revenue delta", "+$5,580 (top tier) vs -$9,857 (bottom tier)"],
            ["New pitch adoption", "Revenue by pitch share quartile", "+$5,300 (top quartile) vs -$9,525 (bottom)"],
          ]}
          highlightCol={2}
        />

        <Callout type="caveat">
          All findings are correlational. We do not have a randomized control group. The Q3→Q4 before/after design partially addresses selection bias, but seasonality and other Q4 factors cannot be ruled out.
        </Callout>
      </div>
    </div>
  );
}

function MethodologySlide() {
  return (
    <div style={{ minHeight: "100vh", background: C.gray50, padding: "80px 40px 120px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <SectionLabel text="2 — Methodology" />
        <h2 style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.gray900, margin: "0 0 12px" }}>
          Methodology
        </h2>
        <p style={{ fontFamily: font, fontSize: 17, color: C.gray500, margin: "0 0 36px", lineHeight: 1.5 }}>
          Data pipeline built with dbt + DuckDB. Staged, cleaned, and modeled for repeatable analysis.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>
          {[
            { title: "Data Sources", desc: "Two static tables: Performance Data (Q3 pre-Gong, Q4 post-Gong) and Gong Engagement Data (Q4 usage metrics). 1,000 reps joined on rep ID." },
            { title: "Pipeline", desc: "Layered dbt project: seeds → staging (type casting) → intermediate (joins, winsorization, DQ flags, tiers) → marts (analyst-facing wide table + thin rollups)." },
            { title: "Engagement Scoring", desc: "Composite index = manager listens + peer listens + deal board touches + (50 × interactivity score). Quartile tiers assigned within population." },
          ].map((card, i) => (
            <div key={i} style={{
              background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12,
              padding: "24px 24px 20px",
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.gray800, fontFamily: font, marginBottom: 8 }}>{card.title}</div>
              <div style={{ fontSize: 14, color: C.gray600, fontFamily: font, lineHeight: 1.6 }}>{card.desc}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.gray800, margin: "0 0 16px" }}>
          Data Cleaning Decisions
        </h3>
        <DataTable
          headers={["Issue", "Affected", "Treatment"]}
          rows={[
            ["Q4 deal size outliers", "~20 reps", "Winsorized at p01/p99 within cohorts (max $3.45M → cap ~$1,567)"],
            ["Q4 deal count outlier", "Few reps", "Winsorized at p01/p99 (one value 499 vs median 99)"],
            ["Negative ramp time", "2 new hires", "Set to null (logically invalid)"],
            ["Revenue vs implied mismatch", "4 reps (0.4%)", "Flagged. Reported revenue used as headline; winsorized implied for robustness"],
          ]}
        />

        <div style={{ marginTop: 24 }}>
          <Callout type="insight">
            <strong>Statistical approach:</strong> Descriptive tier comparisons, Pearson correlations, and OLS regression. All results are correlational. Each rep serves as their own control (Q3 baseline), but we acknowledge this is observational, not experimental.
          </Callout>
        </div>
      </div>
    </div>
  );
}

function OnboardingSlide() {
  const barColors = ["#EF4444", "#F97316", "#22C55E", "#16A34A"];
  return (
    <div style={{ minHeight: "100vh", background: C.white, padding: "80px 40px 120px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <SectionLabel text="3 — Onboarding Acceleration" />
        <h2 style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.gray900, margin: "0 0 6px" }}>
          Onboarding Acceleration
        </h2>
        <p style={{ fontFamily: font, fontSize: 19, color: C.purple, fontWeight: 600, margin: "0 0 36px" }}>
          New hires who engaged most with Gong closed their first deal 14.5 days faster.
        </p>

        <div style={{ background: C.gray50, borderRadius: 16, padding: "28px 24px", marginBottom: 32, border: `1px solid ${C.gray200}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.gray600, fontFamily: font, marginBottom: 16 }}>
            Median Days to First Deal by Gong Adoption Tier
          </div>
          <div style={{ fontSize: 12, color: C.gray400, fontFamily: font, marginBottom: 12 }}>
            Population: 246 new hires (2 excluded for invalid data)
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rampData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.gray200} vertical={false} />
              <XAxis dataKey="tier" tick={{ fontSize: 13, fill: C.gray600, fontFamily: font }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: C.gray400, fontFamily: font }} axisLine={false} tickLine={false} domain={[0, 55]} />
              <Tooltip
                contentStyle={{ fontFamily: font, fontSize: 13, borderRadius: 8, border: `1px solid ${C.gray200}` }}
                formatter={(v) => [`${v} days`, "Median ramp"]}
              />
              <Bar dataKey="days" radius={[6, 6, 0, 0]} maxBarSize={56}>
                {rampData.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <Stat value="14.5 days" label="Gap between Tier 4 and Tier 1 median ramp time" accent />
          <Stat value="~$15,900" label="Revenue value of faster ramp per new hire (14.5 days × $1,097/day)" accent />
        </div>

        <h3 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.gray800, margin: "0 0 16px" }}>
          Which Gong Features Drive Faster Onboarding?
        </h3>
        <DataTable
          headers={["Gong Feature", "Correlation (r)", "p-value", "Strength"]}
          rows={correlationData.map(d => [
            d.feature,
            d.r.toFixed(2),
            d.p,
            Math.abs(d.r) > 0.4 ? "Strong" : Math.abs(d.r) > 0.3 ? "Moderate" : "Weak",
          ])}
          highlightCol={1}
        />

        <div style={{ marginTop: 24 }}>
          <Callout type="action">
            <strong>Actionable finding:</strong> Manager coaching (call reviews) is the single strongest predictor of faster ramp time (r = -0.44). Managers who use Gong to review more new hire calls see those reps close their first deal sooner. This behavior is coachable and scalable.
          </Callout>
        </div>
      </div>
    </div>
  );
}

function ProductivitySlide() {
  return (
    <div style={{ minHeight: "100vh", background: C.gray50, padding: "80px 40px 120px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <SectionLabel text="4 — Sales Productivity & Growth" />
        <h2 style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.gray900, margin: "0 0 6px" }}>
          Sales Productivity & Growth
        </h2>
        <p style={{ fontFamily: font, fontSize: 19, color: C.purple, fontWeight: 600, margin: "0 0 36px" }}>
          Top Gong adopters gained $5,580/quarter while bottom-tier adopters lost $9,857.
        </p>

        <div style={{ background: C.white, borderRadius: 16, padding: "28px 24px", marginBottom: 32, border: `1px solid ${C.gray200}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.gray600, fontFamily: font, marginBottom: 16 }}>
            Avg Revenue Change per Rep (Q3 → Q4) by Gong Adoption Tier
          </div>
          <div style={{ fontSize: 12, color: C.gray400, fontFamily: font, marginBottom: 12 }}>
            All 1,000 reps. Revenue delta = Revenue Per Rep Q4 − Q3 (reported values).
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData} margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.gray200} vertical={false} />
              <XAxis dataKey="tier" tick={{ fontSize: 13, fill: C.gray600, fontFamily: font }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: C.gray400, fontFamily: font }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ fontFamily: font, fontSize: 13, borderRadius: 8, border: `1px solid ${C.gray200}` }}
                formatter={(v) => [`$${v.toLocaleString()}`, "Avg revenue delta"]}
              />
              <ReferenceLine y={0} stroke={C.gray400} strokeWidth={1} />
              <Bar dataKey="delta" radius={[6, 6, 0, 0]} maxBarSize={56}>
                {revenueData.map((d, i) => <Cell key={i} fill={d.delta >= 0 ? C.green : C.red} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <Stat value="$15,437" label="Quarterly per-rep revenue gap between top and bottom adoption tiers" accent />
          <Stat value="$61,748" label="Annualized per-rep gap (×4 quarters)" />
        </div>

        <h3 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.gray800, margin: "0 0 16px" }}>
          New Pitch Adoption Drives Results
        </h3>
        <DataTable
          headers={["Pitch Quartile", "Avg New Pitch Share", "Avg Revenue Delta"]}
          rows={pitchData.map(d => [
            d.quartile === "Q1" ? "Q1 (Most old pitch)" : d.quartile === "Q4" ? "Q4 (Most new pitch)" : d.quartile,
            d.share,
            `$${d.delta.toLocaleString()}`,
          ])}
          highlightCol={2}
        />

        <div style={{ marginTop: 24 }}>
          <Callout type="insight">
            Reps who adopted the new sales messaging outperformed on every metric. Gong enables managers to track pitch compliance and coach toward the new messaging. This is both a measurable behavior change and a directly actionable lever.
          </Callout>
        </div>

        <div style={{ marginTop: 16 }}>
          <Callout type="caveat">
            <strong>Robustness:</strong> All findings hold when using winsorized implied revenue instead of reported revenue. The staircase pattern is stable across metric definitions — this is not driven by outliers.
          </Callout>
        </div>
      </div>
    </div>
  );
}

function WhatIfSlide() {
  return (
    <div style={{ minHeight: "100vh", background: C.white, padding: "80px 40px 120px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <SectionLabel text="5 — Global Rollout Projection" />
        <h2 style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.gray900, margin: "0 0 6px" }}>
          Global Rollout Projection
        </h2>
        <p style={{ fontFamily: font, fontSize: 19, color: C.purple, fontWeight: 600, margin: "0 0 36px" }}>
          "What if Gong were rolled out to all 5,000 reps?"
        </p>

        <h3 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.gray800, margin: "0 0 16px" }}>
          Projection Inputs
        </h3>
        <DataTable
          headers={["Assumption", "Value", "Source"]}
          rows={[
            ["Total global reps", "5,000", "Assignment brief"],
            ["Avg quarterly lift — top-half adopters", "~+$3,424/rep", "Avg of Tier 3 & 4 from Canada data"],
            ["Avg quarterly lift — bottom-half adopters", "~-$7,512/rep", "Avg of Tier 1 & 2 from Canada data"],
            ["New hire proportion", "~25%", "248/1,000 in Canada"],
            ["Effect persistence", "Quarterly × 4", "Conservative (no decay or acceleration)"],
          ]}
        />

        <h3 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.gray800, margin: "36px 0 16px" }}>
          Scenario Model
        </h3>
        <p style={{ fontFamily: font, fontSize: 15, color: C.gray600, lineHeight: 1.6, margin: "0 0 20px" }}>
          The primary lever is adoption rate: what percentage of the 5,000-rep global workforce reaches top-half adoption (Tier 3 or 4)?
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 32 }}>
          {scenarioData.map((s, i) => {
            const colors = [
              { bg: C.gray100, border: C.gray300, text: C.gray700 },
              { bg: C.purpleLight, border: C.purple + "40", text: C.purple },
              { bg: C.greenLight, border: C.green + "40", text: C.green },
            ];
            const c = colors[i];
            return (
              <div key={i} style={{
                background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 14,
                padding: "24px 24px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: c.text, fontFamily: font, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
                  {s.scenario}
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: C.gray900, fontFamily: font }}>
                  {s.pctTop}
                </div>
                <div style={{ fontSize: 13, color: C.gray500, fontFamily: font, marginTop: 4 }}>
                  reps at top-half adoption
                </div>
                <div style={{ marginTop: 16, borderTop: `1px solid ${c.border}`, paddingTop: 12, fontSize: 13, color: C.gray600, fontFamily: font }}>
                  {s.topReps} top-half · {s.bottomReps} bottom-half
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 14, fontFamily: font, color: C.gray600, lineHeight: 1.6, marginBottom: 24, padding: "16px 20px", background: C.gray50, borderRadius: 10, border: `1px solid ${C.gray200}` }}>
          <strong style={{ color: C.gray800 }}>Formula:</strong>{" "}
          Annual Impact = (Top-half reps × quarterly lift × 4) + (Bottom-half reps × quarterly lift × 4)
        </div>

        <h3 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: C.gray800, margin: "0 0 16px" }}>
          Additional Value Not Modeled
        </h3>
        {[
          "Onboarding acceleration: ~$15,900 in additional revenue capacity per new hire (14.5 fewer ramp days)",
          "Pitch compliance at scale: systematic tracking of messaging adoption across 5,000 reps",
          "Competitive intelligence: visibility into competitor mentions helps reps handle objections",
          "Manager leverage: one manager can coach many reps through call reviews — coaching scales sub-linearly with headcount",
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            marginBottom: 8, fontFamily: font, fontSize: 14, color: C.gray700, lineHeight: 1.5,
          }}>
            <span style={{ color: C.purple, fontWeight: 700, flexShrink: 0 }}>+</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function DAGDiagram() {
  const nw = 140, nh = 32;
  const nodes = [
    { id: "RP", label: "raw_performance", x: 85, y: 40, type: "seed" },
    { id: "RG", label: "raw_gong", x: 85, y: 120, type: "seed" },
    { id: "SP", label: "stg_performance", x: 245, y: 40, type: "stg" },
    { id: "SG", label: "stg_gong", x: 245, y: 120, type: "stg" },
    { id: "IMB", label: "int_metric_bounds", x: 405, y: 40, type: "int" },
    { id: "IRE", label: "int_rep_enriched", x: 405, y: 120, type: "int" },
    { id: "MRV", label: "mart_rep_value_insights", x: 580, y: 120, type: "mart", w: 175 },
    { id: "MOD", label: "mart_onboarding_drivers", x: 580, y: 192, type: "sub", w: 175 },
    { id: "MPT", label: "mart_productivity_by_tier", x: 580, y: 244, type: "sub", w: 175 },
  ];

  const fills = {
    seed: { bg: "rgba(255,255,255,0.08)", stroke: "rgba(255,255,255,0.25)" },
    stg: { bg: "rgba(168,85,247,0.18)", stroke: "rgba(168,85,247,0.4)" },
    int: { bg: "rgba(168,85,247,0.28)", stroke: "rgba(168,85,247,0.5)" },
    mart: { bg: "rgba(255,35,112,0.15)", stroke: "rgba(255,35,112,0.4)" },
    sub: { bg: "rgba(255,255,255,0.06)", stroke: "rgba(255,255,255,0.2)" },
  };

  // Pre-compute edge paths with explicit routing so nothing overlaps
  // All edges connect right-side of source to left-side of target,
  // except vertical edges which connect bottom to top.
  const hw = (n) => (n.w || nw) / 2;
  const nm = {};
  nodes.forEach(n => { nm[n.id] = n; });

  const paths = [
    // RP → SP (horizontal, same row)
    `M${nm.RP.x+hw(nm.RP)} ${nm.RP.y+nh/2} L${nm.SP.x-hw(nm.SP)} ${nm.SP.y+nh/2}`,
    // RG → SG (horizontal, same row)
    `M${nm.RG.x+hw(nm.RG)} ${nm.RG.y+nh/2} L${nm.SG.x-hw(nm.SG)} ${nm.SG.y+nh/2}`,
    // SP → IMB (horizontal, same row)
    `M${nm.SP.x+hw(nm.SP)} ${nm.SP.y+nh/2} L${nm.IMB.x-hw(nm.IMB)} ${nm.IMB.y+nh/2}`,
    // SP → IRE (L-bend: right from SP, down, then right into IRE)
    `M${nm.SP.x+hw(nm.SP)} ${nm.SP.y+nh/2} L${nm.SP.x+hw(nm.SP)+20} ${nm.SP.y+nh/2} L${nm.SP.x+hw(nm.SP)+20} ${nm.IRE.y+nh/2} L${nm.IRE.x-hw(nm.IRE)} ${nm.IRE.y+nh/2}`,
    // SG → IRE (horizontal, same row)
    `M${nm.SG.x+hw(nm.SG)} ${nm.SG.y+nh/2} L${nm.IRE.x-hw(nm.IRE)} ${nm.IRE.y+nh/2}`,
    // IMB → IRE (vertical, same column)
    `M${nm.IMB.x} ${nm.IMB.y+nh} L${nm.IRE.x} ${nm.IRE.y}`,
    // IRE → MRV (horizontal, same row)
    `M${nm.IRE.x+hw(nm.IRE)} ${nm.IRE.y+nh/2} L${nm.MRV.x-hw(nm.MRV)} ${nm.MRV.y+nh/2}`,
    // MRV → MOD (vertical)
    `M${nm.MRV.x} ${nm.MRV.y+nh} L${nm.MOD.x} ${nm.MOD.y}`,
    // MRV → MPT (vertical, offset left to avoid overlap with MOD arrow)
    `M${nm.MRV.x-20} ${nm.MRV.y+nh} L${nm.MPT.x-20} ${nm.MPT.y}`,
  ];

  const dashIdx = 5; // IMB→IRE is dashed (cross-join)

  const colLabels = [
    { x: 85, label: "SEEDS" },
    { x: 245, label: "STAGING" },
    { x: 405, label: "INTERMEDIATE" },
    { x: 580, label: "MARTS" },
  ];

  return (
    <svg viewBox="0 0 700 296" style={{ width: "100%", height: "auto" }}>
      <defs>
        <marker id="dag-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      {colLabels.map((cl, i) => (
        <text key={i} x={cl.x} y={18} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontWeight="600" fontFamily="sans-serif" letterSpacing="1.5">{cl.label}</text>
      ))}
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" markerEnd="url(#dag-arr)" strokeDasharray={i === dashIdx ? "3 3" : "none"} />
      ))}
      {nodes.map((n) => {
        const w = n.w || nw;
        const f = fills[n.type];
        return (
          <g key={n.id}>
            <rect x={n.x - w/2} y={n.y} width={w} height={nh} rx={6} fill={f.bg} stroke={f.stroke} strokeWidth={n.type === "mart" ? 1.5 : 0.5} />
            <text x={n.x} y={n.y + nh/2 + 1} textAnchor="middle" dominantBaseline="central" fill={n.type === "mart" ? "#FFFFFF" : "rgba(255,255,255,0.8)"} fontSize={n.type === "sub" ? 9 : 10.5} fontFamily="'SF Mono','Fira Code','Consolas',monospace" fontWeight={n.type === "mart" ? 600 : 400}>{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ScalabilitySlide() {
  const pillars = [
    {
      icon: "🏗",
      title: "Data Architecture",
      items: [
        "Layered dbt project: staging → intermediate → marts",
        "Customer-specific YAML configs (metric mappings, thresholds, date ranges)",
        "New customers onboarded by adding a config file, not writing new SQL",
        "Standardized metric definitions in dbt docs",
      ],
    },
    {
      icon: "📊",
      title: "Tooling & Self-Service",
      items: [
        "Looker/Tableau dashboard with customer filter — AEs select and see pre-built value slides",
        "Automated PDF/slide export per customer on a scheduled pipeline",
        "Projection calculator for AEs: input reps + adoption rate → annual impact range",
        "Enablement playbook: which slide to lead with by buyer persona",
      ],
    },
    {
      icon: "🔒",
      title: "Quality & Governance",
      items: [
        "dbt tests on every model: not_null, unique, accepted_values, relationships",
        "Pre-flight anomaly scan before surfacing data to GTM",
        "Metric definitions registry (living doc, version-controlled)",
        "Quarterly calibration: are engagement weights and tier thresholds stable?",
      ],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.gray50, padding: "80px 40px 120px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <SectionLabel text="6 — Scaling for 100+ Customers" />
        <h2 style={{ fontFamily: font, fontSize: 36, fontWeight: 800, color: C.gray900, margin: "0 0 6px" }}>
          Scaling for 100+ Customers
        </h2>
        <p style={{ fontFamily: font, fontSize: 17, color: C.gray500, margin: "0 0 36px", lineHeight: 1.5 }}>
          Turning a one-off analysis into a repeatable, self-serve capability for Gong's GTM teams.
        </p>

        {pillars.map((p, pi) => (
          <div key={pi} style={{
            background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14,
            padding: "28px 28px 24px", marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <h3 style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: C.gray800, margin: 0 }}>
                {p.title}
              </h3>
            </div>
            {p.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8,
                fontFamily: font, fontSize: 14, color: C.gray700, lineHeight: 1.5,
              }}>
                <span style={{ color: C.purple, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                {item}
              </div>
            ))}
          </div>
        ))}

        <div style={{
          background: `linear-gradient(145deg, ${C.purpleDark} 0%, ${C.purple} 100%)`,
          borderRadius: 16, padding: "36px 28px 28px", marginTop: 32,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: font, marginBottom: 24, textAlign: "center", letterSpacing: "0.5px" }}>
            Data Model
          </div>
          <DAGDiagram />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: font, marginTop: 12, textAlign: "center" }}>
            github.com/alsoknownaslj/gong-value-dbt
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: "center", padding: "48px 0" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.gray800, fontFamily: font }}>
            Thank you!
          </div>
          <div style={{ fontSize: 14, color: C.gray400, fontFamily: font, marginTop: 12 }}>
            Lauren Jackson · laurenjackson1028@gmail.com · github.com/alsoknownaslj
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ───
const SLIDES = [TitleSlide, ExecSummarySlide, MethodologySlide, OnboardingSlide, ProductivitySlide, WhatIfSlide, ScalabilitySlide];

export default function GongPresentation() {
  const [current, setCurrent] = useState(0);
  const slideRefs = useRef([]);
  const isScrolling = useRef(false);

  const scrollTo = (idx) => {
    isScrolling.current = true;
    setCurrent(idx);
    slideRefs.current[idx]?.scrollIntoView({ behavior: "instant" });
    setTimeout(() => { isScrolling.current = false; }, 100);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        scrollTo(Math.min(SLIDES.length - 1, current + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        scrollTo(Math.max(0, current - 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrolling.current) return;
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.indexOf(entry.target);
            if (idx !== -1) setCurrent(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    slideRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.gray100}; }
        ::-webkit-scrollbar-thumb { background: ${C.gray300}; border-radius: 2px; }
      `}</style>
      {SLIDES.map((Slide, i) => (
        <div key={i} ref={el => slideRefs.current[i] = el}>
          <Slide />
        </div>
      ))}
      <SlideNav current={current} total={SLIDES.length} onNav={scrollTo} />
    </div>
  );
}
