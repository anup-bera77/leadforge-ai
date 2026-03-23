import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

/* ─── Design tokens (unchanged) ─────────────────────────────────────────*/
const T = {
  bg:         "#0a0a0b",
  surface:    "#111113",
  surfaceEl:  "#18181b",
  surfaceHov: "#1c1c20",
  border:     "#1f1f23",
  borderHov:  "#2e2e35",
  text:       "#ededef",
  textMid:    "#8b8b96",
  textDim:    "#45454f",
  accent:     "#5b5bd6",
  accentLt:   "#7b7cf5",
  accentDim:  "rgba(91,91,214,0.14)",
  green:      "#30a46c",
  greenDim:   "rgba(48,164,108,0.12)",
  amber:      "#f5a623",
  amberDim:   "rgba(245,166,35,0.1)",
  red:        "#e5484d",
  redDim:     "rgba(229,72,77,0.1)",
  blue:       "#0091ff",
  blueDim:    "rgba(0,145,255,0.1)",
};

/* ─── Icons (unchanged) ──────────────────────────────────────────────────*/
const Ic = {
  logo:     <svg width="16" height="16" viewBox="0 0 100 100" fill="none"><path d="M10 10L45 90L90 10" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  run:      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  activity: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  leads:    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  mail:     <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a2 2 0 0 1 3.09-2.1l1.27 1.27a2 2 0 0 1-.45 2.11 16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  linkedin: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  pin:      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  ext:      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  chevD:    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  check:    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  spin:     <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{animation:"_spin .8s linear infinite"}}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
  home:     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  settings: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  globe:    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  output:   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 17 13 17"/><polyline points="22 7 13 7"/><polyline points="22 12 13 12"/><polyline points="2 17 7 12 2 7"/></svg>,
  tag:      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  warning:  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  download: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  filter:   <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

/* ─── Helpers (unchanged) ────────────────────────────────────────────────*/
const avatarColor = (str = "") => {
  const p = ["#5b5bd6","#7b7cf5","#30a46c","#0091ff","#f5a623","#e5484d","#8e4ec6","#12a594"];
  let h = 0; for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return p[h % p.length];
};

const fmtTime = (t) => {
  if (!t) return "";
  try { return new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }
  catch { return String(t); }
};

const eventStyle = (msg = "") => {
  const m = msg.toLowerCase();
  if (m.includes("error") || m.includes("fail"))                              return { dot: T.red,    label: "error"  };
  if (m.includes("found") || m.includes("complet") || m.includes("success")) return { dot: T.green,  label: "done"   };
  if (m.includes("start") || m.includes("launch") || m.includes("init"))     return { dot: T.accent, label: "init"   };
  if (m.includes("navigat") || m.includes("brows") || m.includes("fetch"))   return { dot: T.blue,   label: "browse" };
  return { dot: T.textDim, label: "info" };
};

const EXAMPLES = [
  "Find 10 AI startups in Germany and extract emails",
  "Scrape SaaS companies in Singapore with LinkedIn",
  "Find fintech companies in London with contact info",
  "Extract health tech startups in San Francisco",
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   AgentStatusBadge — inline colored pill
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function AgentStatusBadge({ status }) {
  const map = {
    idle:      { color: T.textDim, bg: "transparent",  border: T.border,                     dot: T.textDim, label: "Idle"              },
    running:   { color: T.amber,   bg: T.amberDim,     border: "rgba(245,166,35,0.25)",       dot: T.amber,   label: "Agent is working…" },
    completed: { color: T.green,   bg: T.greenDim,     border: "rgba(48,164,108,0.25)",       dot: T.green,   label: "Completed"         },
    error:     { color: T.red,     bg: T.redDim,       border: "rgba(229,72,77,0.25)",        dot: T.red,     label: "Failed"            },
  };
  const s = map[status] || map.idle;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 10px", borderRadius:"6px", background:s.bg, border:`1px solid ${s.border}`, transition:"all .2s ease" }}>
      <div style={{ width:7, height:7, borderRadius:"50%", background:s.dot, flexShrink:0, boxShadow: status==="running" ? `0 0 6px ${s.dot}` : "none", animation: status==="running" ? "_blink 1.2s ease-in-out infinite" : "none" }}/>
      <span style={{ fontSize:"12px", fontWeight:500, color:s.color, whiteSpace:"nowrap" }}>{s.label}</span>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ProgressBar — indeterminate shimmer, shown only when running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function ProgressBar({ active }) {
  if (!active) return null;
  return (
    <div style={{ height:2, background:T.border, overflow:"hidden", flexShrink:0 }}>
      <div style={{ height:"100%", width:"40%", background:`linear-gradient(90deg, transparent, ${T.accent}, transparent)`, animation:"_progress 1.6s ease-in-out infinite" }}/>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TaskScopedBadge — small "Task #xyz" chip shown near section headers
   Lets the user know data is scoped to the current run.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function TaskBadge({ taskId }) {
  if (!taskId) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", fontSize:"10px", fontWeight:500, color:T.accentLt, background:T.accentDim, border:`1px solid rgba(91,91,214,0.2)`, padding:"2px 6px", borderRadius:"4px", fontFamily:"'Geist Mono', monospace" }}>
      {Ic.tag} task/{String(taskId).slice(-8)}
    </span>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LastRunSummary — FIXED: counts are derived from task-scoped leads only
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function LastRunSummary({ leads, status, taskDescription, taskId }) {
  // Only render after a completed run that actually produced leads
  if (status !== "completed" || leads.length === 0) return null;

  // All counts are from task-scoped `leads` prop — no historical bleed
  const emails    = leads.filter(l => l.email).length;
  const phones    = leads.filter(l => l.phone).length;
  const linkedins = leads.filter(l => l.linkedin).length;

  const pills = [
    { label: `${leads.length} lead${leads.length !== 1 ? "s" : ""} extracted`, color: T.text,     bg: T.surfaceEl },
    { label: `${emails} email${emails !== 1 ? "s" : ""} found`,                color: T.accentLt, bg: T.accentDim },
    { label: `${phones} phone${phones !== 1 ? "s" : ""}`,                      color: T.amber,    bg: T.amberDim  },
    { label: `${linkedins} LinkedIn`,                                           color: T.green,    bg: T.greenDim  },
  ];

  return (
    <div style={{ padding:"0 22px 14px", animation:"_fi .4s ease both" }}>
      <div style={{ padding:"12px 16px", background:T.surfaceEl, border:`1px solid rgba(48,164,108,0.25)`, borderRadius:"10px", display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
        {/* Green check + "Run complete" */}
        <div style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
          <div style={{ width:22, height:22, borderRadius:"6px", background:T.greenDim, border:"1px solid rgba(48,164,108,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:T.green }}>{Ic.check}</span>
          </div>
          <span style={{ fontSize:"12px", fontWeight:600, color:T.green }}>Run complete</span>
        </div>

        <div style={{ width:1, height:16, background:T.border, flexShrink:0 }}/>

        {/* Pill counts */}
        {pills.map((p, i) => (
          <span key={i} style={{ fontSize:"12px", color:p.color, background:p.bg, padding:"3px 8px", borderRadius:"5px", fontWeight:500, whiteSpace:"nowrap" }}>
            {p.label}
          </span>
        ))}

        {/* Task ID + description */}
        {taskId && (
          <>
            <div style={{ width:1, height:16, background:T.border, flexShrink:0 }}/>
            <TaskBadge taskId={taskId} />
          </>
        )}
        {taskDescription && (
          <span style={{ fontSize:"11px", color:T.textDim, fontStyle:"italic", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:260 }}>
            "{taskDescription}"
          </span>
        )}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NoEmailBadge — styled "No email" pill shown when email is absent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function NoEmailBadge() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      fontSize: "11px", fontWeight: 500, color: T.red,
      background: T.redDim,
      border: "1px solid rgba(229,72,77,0.22)",
      padding: "2px 7px", borderRadius: "4px",
      letterSpacing: "0.01em",
    }}>
      No email
    </span>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CopyEmailButton — copies email to clipboard, shows "Copied!" feedback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy email address"
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "1px 5px", borderRadius: "4px", border: "none",
        background: copied ? T.greenDim : "transparent",
        color: copied ? T.green : T.textDim,
        fontSize: "10px", fontWeight: 500, fontFamily: "inherit",
        cursor: "pointer", transition: "all .15s ease",
        flexShrink: 0, lineHeight: 1.6,
      }}
      onMouseEnter={e => { if (!copied) { e.currentTarget.style.background = T.surfaceEl; e.currentTarget.style.color = T.textMid; }}}
      onMouseLeave={e => { if (!copied) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textDim; }}}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   AgentOutputPanel — FIXED: receives task-scoped leads, shows newest first
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function AgentOutputPanel({ leads, status, taskId }) {
  // Newest first — reverse a copy so we don't mutate props
  const ordered = [...leads].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  const isEmpty = ordered.length === 0;

  // NEW: client-side CSV export of current task's leads only
  const exportCurrentLeads = () => {
    if (!leads.length) return;
    const headers = ["company","location","email","phone","linkedin"];
    const csv = [
      headers.join(","),
      ...leads.map(l =>
        headers.map(h => `"${(l[h] || "").replace(/"/g,'""')}"`).join(",")
      )
    ].join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `agent_output_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ padding:"0 22px 18px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
        <span style={{ color:T.textDim, display:"flex" }}>{Ic.output}</span>
        <span style={{ fontSize:"12px", fontWeight:500, color:T.textMid }}>Agent Output</span>
        {leads.length > 0 && (
          <span style={{ fontSize:"11px", color:T.textDim, background:T.bg, border:`1px solid ${T.border}`, padding:"1px 6px", borderRadius:"4px", fontVariantNumeric:"tabular-nums" }}>
            {leads.length}
          </span>
        )}
        <TaskBadge taskId={taskId} />
        {status === "running" && (
          <span style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"4px", fontSize:"11px", color:T.amber }}>
            {Ic.spin} live
          </span>
        )}
        {/* NEW: Quick export — only shown when there are leads and agent is not running */}
        {leads.length > 0 && status !== "running" && (
          <button
            onClick={exportCurrentLeads}
            title="Export these leads as CSV"
            style={{ marginLeft: status === "running" ? "0" : "auto", display:"flex", alignItems:"center", gap:"4px", padding:"3px 9px", borderRadius:"5px", border:`1px solid ${T.border}`, background:"transparent", color:T.textDim, fontSize:"12px", fontWeight:500, fontFamily:"inherit", cursor:"pointer", transition:"all .12s ease" }}
            onMouseEnter={e => { e.currentTarget.style.background = T.surfaceEl; e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.borderHov; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textDim; e.currentTarget.style.borderColor = T.border; }}
          >
            {Ic.download} Export
          </button>
        )}
      </div>

      {isEmpty ? (
        /* Empty state */
        <div style={{ padding:"18px 16px", background:T.surfaceEl, border:`1px solid ${T.border}`, borderRadius:"10px", display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:34, height:34, borderRadius:"8px", background:T.amberDim, border:`1px solid rgba(245,166,35,0.2)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <span style={{ color:T.amber }}>{status === "running" ? Ic.spin : Ic.warning}</span>
          </div>
          <div>
            <div style={{ fontSize:"13px", fontWeight:500, color:T.text }}>
              {status === "running" ? "AI is browsing and extracting leads…" : "No results yet"}
            </div>
            <div style={{ fontSize:"12px", color:T.textDim, marginTop:"2px" }}>
              {status === "running" ? "Results will appear here as the agent finds them" : "Run an agent task to see output here"}
            </div>
          </div>
        </div>
      ) : (
        /* Result cards — newest first */
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(218px, 1fr))", gap:"8px" }}>
          {ordered.map((lead, i) => {
            const color = avatarColor(lead.company || "");
            const init  = (lead.company || "?")[0].toUpperCase();
            return (
              <div key={i}
                style={{
                  padding:"12px 14px", background:T.surfaceEl,
                  // Feature 2: subtle green border when email exists
                  border: lead.email
                    ? `1px solid rgba(48,164,108,0.35)`
                    : `1px solid ${T.border}`,
                  borderRadius:"10px", animation:"_fi .3s ease both",
                  animationDelay:`${i * 0.04}s`, transition:"border-color .15s"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = lead.email ? "rgba(48,164,108,0.6)" : T.borderHov}
                onMouseLeave={e => e.currentTarget.style.borderColor = lead.email ? "rgba(48,164,108,0.35)" : T.border}
              >
                {/* Company header */}
                <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
                  <div style={{ width:28, height:28, borderRadius:"7px", background:`${color}20`, color, border:`1px solid ${color}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:700, flexShrink:0 }}>
                    {init}
                  </div>
                  <span style={{ fontSize:"13px", fontWeight:600, color:T.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {lead.company || "Unknown"}
                  </span>
                </div>
                {/* Fields */}
                <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                  {lead.location && (
                    <div style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color:T.textMid }}>
                      <span style={{ color:T.textDim, flexShrink:0 }}>{Ic.pin}</span>
                      <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lead.location}</span>
                    </div>
                  )}
                  {lead.email ? (
                    /* Feature 3: email row with copy button */
                    <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                      <a href={`mailto:${lead.email}`} style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color:T.accentLt, textDecoration:"none", flex:1, minWidth:0 }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                        <span style={{ color:T.textDim, flexShrink:0 }}>{Ic.mail}</span>
                        <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lead.email}</span>
                      </a>
                      <CopyEmailButton email={lead.email} />
                    </div>
                  ) : (
                    /* Feature 1: NoEmailBadge instead of plain text */
                    <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                      <span style={{ color:T.textDim, flexShrink:0 }}>{Ic.mail}</span>
                      <NoEmailBadge />
                    </div>
                  )}
                  {lead.phone ? (
                    <div style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color:T.textMid }}>
                      <span style={{ color:T.textDim, flexShrink:0 }}>{Ic.phone}</span>
                      <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{lead.phone}</span>
                    </div>
                  ) : (
                    <div style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color:T.textDim }}>
                      <span>{Ic.phone}</span><span>No phone</span>
                    </div>
                  )}
                  {lead.linkedin && (
                    <a href={lead.linkedin} target="_blank" rel="noopener noreferrer"
                      style={{ display:"inline-flex", alignItems:"center", gap:"5px", fontSize:"12px", color:T.textMid, textDecoration:"none", marginTop:"2px" }}
                      onMouseEnter={e => e.currentTarget.style.color = T.text}
                      onMouseLeave={e => e.currentTarget.style.color = T.textMid}>
                      <span style={{ color:T.textDim }}>{Ic.linkedin}</span> LinkedIn {Ic.ext}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar — includes Task History section ────────────────────────────*/
function Sidebar({ tab, setTab, nLeads, nEvents, status, tasks, taskId, onSelectTask }) {
  const items = [
    { id: "overview",  icon: Ic.home,     label: "Overview"  },
    { id: "activity",  icon: Ic.activity, label: "Activity",  n: nEvents },
    { id: "leads",     icon: Ic.leads,    label: "Leads",     n: nLeads  },
    { id: "settings",  icon: Ic.settings, label: "Settings"   },
  ];

  const taskDot = (t) => {
    const s = (t.status || "").toLowerCase();
    if (s === "running")                      return { bg: T.amber, shadow: `0 0 4px ${T.amber}`, anim: "_blink 1.4s ease-in-out infinite" };
    if (s === "completed" || s === "done")    return { bg: T.green,  shadow: "none", anim: "none" };
    if (s === "error"     || s === "failed")  return { bg: T.red,    shadow: "none", anim: "none" };
    return                                           { bg: T.textDim, shadow: "none", anim: "none" };
  };

  return (
    <aside style={{ width:216, flexShrink:0, background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0 }}>
      {/* Brand */}
      <div style={{ padding:"16px 14px 12px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:"8px", cursor:"pointer" }}>
        <div style={{ width:26, height:26, borderRadius:"7px", background:T.accent, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>
          {Ic.logo}
        </div>
        <span style={{ fontSize:"13px", fontWeight:600, color:T.text, letterSpacing:"-0.01em" }}>LeadForge</span>
        <span style={{ marginLeft:"auto", color:T.textDim }}>{Ic.chevD}</span>
      </div>

      {/* Nav */}
      <nav style={{ padding:"8px 8px 4px", flexShrink:0 }}>
        <div style={{ fontSize:"11px", fontWeight:500, color:T.textDim, padding:"6px 8px 4px", letterSpacing:"0.05em", textTransform:"uppercase" }}>Workspace</div>
        {items.map(it => {
          const on = tab === it.id;
          return (
            <button key={it.id} onClick={() => setTab(it.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:"7px", padding:"5px 8px", borderRadius:"6px", border:"none", background: on ? T.surfaceEl : "transparent", color: on ? T.text : T.textMid, fontSize:"13px", fontWeight: on ? 500 : 400, fontFamily:"inherit", cursor:"pointer", transition:"background .1s, color .1s", marginBottom:"1px" }}
              onMouseEnter={e => { if (!on) { e.currentTarget.style.background = T.surfaceEl; e.currentTarget.style.color = T.text; }}}
              onMouseLeave={e => { if (!on) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMid; }}}
            >
              <span style={{ color: on ? T.accentLt : T.textDim, display:"flex", flexShrink:0 }}>{it.icon}</span>
              <span style={{ flex:1, textAlign:"left" }}>{it.label}</span>
              {it.n > 0 && (
                <span style={{ fontSize:"11px", color:T.textDim, background:T.bg, border:`1px solid ${T.border}`, padding:"0 5px", borderRadius:"4px", fontVariantNumeric:"tabular-nums" }}>
                  {it.n}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Recent Tasks ──────────────────────────────────────────────────*/}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:0, borderTop:`1px solid ${T.border}` }}>
        {/* Section header */}
        <div style={{ padding:"8px 16px 4px", flexShrink:0, display:"flex", alignItems:"center", gap:"6px" }}>
          <span style={{ fontSize:"11px", fontWeight:500, color:T.textDim, letterSpacing:"0.05em", textTransform:"uppercase", flex:1 }}>Recent Tasks</span>
          {tasks.length > 0 && (
            <span style={{ fontSize:"10px", color:T.textDim, background:T.bg, border:`1px solid ${T.border}`, padding:"0 5px", borderRadius:"4px", fontVariantNumeric:"tabular-nums" }}>
              {tasks.length}
            </span>
          )}
        </div>

        {/* Scrollable list */}
        <div style={{ flex:1, overflowY:"auto", padding:"2px 8px 8px" }}>
          {tasks.length === 0 ? (
            <div style={{ padding:"10px 8px", fontSize:"12px", color:T.textDim, textAlign:"center" }}>
              No tasks yet
            </div>
          ) : (
            tasks.map((t) => {
              const dot        = taskDot(t);
              const isSelected = String(t.id) === String(taskId);
              const desc       = t.description || t.task || "Untitled task";
              const short      = desc.length > 26 ? desc.slice(0, 24) + "…" : desc;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  title={desc}
                  style={{ width:"100%", display:"flex", alignItems:"flex-start", gap:"7px", padding:"6px 8px", borderRadius:"6px", border:"none", background: isSelected ? T.accentDim : "transparent", cursor:"pointer", fontFamily:"inherit", transition:"background .1s", marginBottom:"1px", textAlign:"left" }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = T.surfaceEl; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ width:6, height:6, borderRadius:"50%", background:dot.bg, boxShadow:dot.shadow, animation:dot.anim, flexShrink:0, marginTop:"5px" }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"12px", color: isSelected ? T.accentLt : T.text, fontWeight: isSelected ? 500 : 400, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", lineHeight:1.4 }}>
                      {short}
                    </div>
                    {t.created_at && (
                      <div style={{ fontSize:"10px", color:T.textDim, marginTop:"1px", fontVariantNumeric:"tabular-nums" }}>
                        {fmtTime(t.created_at)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Status pill */}
      <div style={{ padding:"10px", borderTop:`1px solid ${T.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", borderRadius:"8px", background:T.surfaceEl, border:`1px solid ${T.border}` }}>
          <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, background: status==="running" ? T.amber : status==="completed" ? T.green : T.textDim, boxShadow: status==="running" ? `0 0 5px ${T.amber}` : "none", animation: status==="running" ? "_blink 1.4s ease-in-out infinite" : "none" }}/>
          <div>
            <div style={{ fontSize:"12px", fontWeight:500, color:T.text }}>
              {status === "running" ? "Agent running" : status === "completed" ? "Completed" : "Idle"}
            </div>
            <div style={{ fontSize:"11px", color:T.textDim }}>
              {status === "running" ? "Processing task…" : "Ready for task"}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── TopBar ─────────────────────────────────────────────────────────────*/
function TopBar({ nLeads, status, taskId }) {
  return (
    <header style={{ height:46, display:"flex", alignItems:"center", padding:"0 22px", borderBottom:`1px solid ${T.border}`, background:T.surface, position:"sticky", top:0, zIndex:20, gap:"8px" }}>
      <div style={{ flex:1, display:"flex", alignItems:"center", gap:"6px" }}>
        <span style={{ fontSize:"13px", color:T.textDim }}>LeadForge</span>
        <span style={{ fontSize:"13px", color:T.textDim }}>/</span>
        <span style={{ fontSize:"13px", fontWeight:500, color:T.text }}>Campaign</span>
        {taskId && <TaskBadge taskId={taskId} />}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
        <AgentStatusBadge status={status} />
        {nLeads > 0 && (
          <span style={{ display:"flex", alignItems:"center", gap:"5px", padding:"3px 9px", borderRadius:"5px", background:T.greenDim, border:"1px solid rgba(48,164,108,0.2)", fontSize:"12px", color:T.green, fontWeight:500 }}>
            {Ic.check} {nLeads} leads
          </span>
        )}
        <div style={{ width:26, height:26, borderRadius:"6px", background:T.accent, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"11px", fontWeight:700 }}>U</div>
      </div>
    </header>
  );
}

/* ─── CommandInput (unchanged, + loading message) ────────────────────────*/
function CommandInput({ task, setTask, onRun, loading }) {
  const [focus, setFocus] = useState(false);
  const [ph, setPh]       = useState(0);
  useEffect(() => { const t = setInterval(() => setPh(i => (i + 1) % EXAMPLES.length), 3500); return () => clearInterval(t); }, []);
  const disabled = loading || !task.trim();
  return (
    <div style={{ padding:"22px 22px 16px" }}>
      <div style={{ marginBottom:"12px" }}>
        <h1 style={{ fontSize:"17px", fontWeight:600, color:T.text, letterSpacing:"-0.025em", margin:0 }}>New Agent Task</h1>
        <p style={{ fontSize:"12px", color:T.textMid, marginTop:"2px" }}>Describe what to find — the AI plans, browses, and extracts leads autonomously.</p>
      </div>
      <div style={{ background:T.surfaceEl, border:`1px solid ${focus ? T.accent : T.border}`, borderRadius:"10px", transition:"border-color .15s, box-shadow .15s", boxShadow: focus ? `0 0 0 3px ${T.accentDim}` : "none", overflow:"hidden" }}>
        <textarea
          value={task}
          onChange={e => setTask(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onRun(); }}
          placeholder={EXAMPLES[ph]}
          rows={2}
          style={{ width:"100%", border:"none", outline:"none", resize:"none", background:"transparent", color:T.text, fontSize:"14px", fontFamily:"inherit", padding:"12px 16px 10px", lineHeight:1.6 }}
        />
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", borderTop:`1px solid ${T.border}` }}>
          <span style={{ fontSize:"11px", color:T.textDim }}>⌘ Enter to run</span>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            {loading && (
              <span style={{ fontSize:"12px", color:T.amber, display:"flex", alignItems:"center", gap:"5px", animation:"_fi .2s ease" }}>
                {Ic.globe} AI is browsing and extracting leads…
              </span>
            )}
            <button onClick={onRun} disabled={disabled} style={{ display:"flex", alignItems:"center", gap:"5px", padding:"5px 13px", borderRadius:"6px", border:`1px solid ${disabled ? T.border : T.accent}`, background: disabled ? T.surfaceEl : T.accent, color: disabled ? T.textDim : "#fff", fontSize:"13px", fontWeight:500, fontFamily:"inherit", cursor: disabled ? "not-allowed" : "pointer", transition:"all .12s ease" }}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = T.accentLt; }}
              onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = T.accent; }}
            >
              {loading ? <>{Ic.spin} Running…</> : <>{Ic.run} Run Agent</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat (unchanged) ───────────────────────────────────────────────────*/
function Stat({ label, value, sub, color }) {
  return (
    <div style={{ padding:"13px 14px", background:T.surfaceEl, border:`1px solid ${T.border}`, borderRadius:"8px" }}>
      <div style={{ fontSize:"11px", color:T.textDim, textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"7px" }}>{label}</div>
      <div style={{ fontSize:"26px", fontWeight:600, color: color || T.text, letterSpacing:"-0.04em", lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize:"11px", color:T.textDim, marginTop:"4px" }}>{sub}</div>}
    </div>
  );
}

/* ─── ActivityFeed (unchanged, auto-scroll) ──────────────────────────────*/
function ActivityFeed({ items, status, compact }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [items.length]);

  if (!items.length) return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:T.textDim, gap:"6px", padding:"40px 24px" }}>
      <span style={{ fontSize:"22px", opacity:0.4 }}>◎</span>
      <span style={{ fontSize:"13px" }}>{status === "idle" ? "No activity yet" : "Initializing…"}</span>
    </div>
  );

  return (
    <div ref={ref} style={{ flex:1, overflowY:"auto", padding: compact ? "2px 0" : "4px 0" }}>
      {items.map((item, i) => {
        const es     = eventStyle(item.message);
        const isLast = i === items.length - 1;
        const fresh  = isLast && status === "running";
        return (
          <div key={i} style={{ display:"flex", padding: compact ? "0 14px" : "0 22px", animation:"_fi .25s ease both", animationDelay:`${Math.min(i, 12) * 0.02}s`, background: fresh ? "rgba(245,166,35,0.03)" : "transparent" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:"12px", paddingTop:"12px" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, background:es.dot, boxShadow: fresh ? `0 0 6px ${es.dot}` : "none", animation: fresh ? "_blink 1.4s ease-in-out infinite" : "none" }}/>
              {i < items.length - 1 && <div style={{ flex:1, width:1, background:T.border, minHeight:18, marginTop:3 }}/>}
            </div>
            <div style={{ paddingTop:"8px", paddingBottom:"8px", flex:1 }}>
              <div style={{ fontSize:"13px", color: fresh ? T.text : T.textMid, fontWeight: fresh ? 500 : 400, lineHeight:1.5 }}>{item.message}</div>
              <div style={{ fontSize:"11px", color:T.textDim, marginTop:"2px", fontVariantNumeric:"tabular-nums" }}>{fmtTime(item.time) || item.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── LeadsTable — FIXED: newest-first ordering, task-scoped data ────────*/
function LeadsTable({ leads }) {
  const [hov, setHov] = useState(null);

  // ── CHANGE: reverse so newest rows appear at the top ──────────────────
  const ordered = [...leads].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  if (!ordered.length) return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:T.textDim, gap:"8px", padding:"60px 24px" }}>
      <span style={{ fontSize:"24px", opacity:0.3 }}>◈</span>
      <span style={{ fontSize:"13px", color:T.textMid }}>No leads found yet</span>
      <span style={{ fontSize:"12px", color:T.textDim }}>Run an agent task to start finding leads</span>
    </div>
  );

  const cols = [
    { key:"company",  label:"Company",  w:"22%" },
    { key:"location", label:"Location", w:"17%" },
    { key:"email",    label:"Email",    w:"25%" },
    { key:"phone",    label:"Phone",    w:"16%" },
    { key:"linkedin", label:"LinkedIn", w:"20%" },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead style={{ position:"sticky", top:0, zIndex:5, background:T.surface }}>
          <tr style={{ borderBottom:`1px solid ${T.border}` }}>
            {cols.map(c => (
              <th key={c.key} style={{ padding:"9px 16px", textAlign:"left", fontSize:"11px", fontWeight:500, color:T.textDim, letterSpacing:"0.04em", textTransform:"uppercase", width:c.w }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordered.map((lead, i) => {
            const color = avatarColor(lead.company || "");
            const init  = (lead.company || "?")[0].toUpperCase();
            const isH   = hov === i;
            return (
              <tr key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                style={{ background: isH ? T.surfaceEl : "transparent", borderBottom:`1px solid ${T.border}`, transition:"background .1s ease", animation:"_fi .35s ease both", animationDelay:`${i * 0.03}s` }}>
                <td style={{ padding:"10px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:24, height:24, borderRadius:"6px", background:`${color}20`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700, flexShrink:0, border:`1px solid ${color}30` }}>{init}</div>
                    <span style={{ fontSize:"13px", fontWeight:500, color:T.text }}>{lead.company || "—"}</span>
                  </div>
                </td>
                <td style={{ padding:"10px 16px" }}>
                  {lead.location
                    ? <span style={{ fontSize:"13px", color:T.textMid, display:"flex", alignItems:"center", gap:"4px" }}><span style={{ color:T.textDim }}>{Ic.pin}</span>{lead.location}</span>
                    : <span style={{ color:T.textDim, fontSize:"13px" }}>—</span>}
                </td>
                <td style={{ padding:"10px 16px" }}>
                  {lead.email
                    ? /* Feature 3: email + inline copy button */
                      <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                        <a href={`mailto:${lead.email}`} style={{ fontSize:"13px", color:T.accentLt, textDecoration:"none", display:"flex", alignItems:"center", gap:"4px", flex:1, minWidth:0 }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                          <span style={{ color:T.textDim }}>{Ic.mail}</span>
                          <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:160 }}>{lead.email}</span>
                        </a>
                        <CopyEmailButton email={lead.email} />
                      </div>
                    : /* Feature 1: NoEmailBadge instead of plain dash */
                      <NoEmailBadge />}
                </td>
                <td style={{ padding:"10px 16px" }}>
                  {lead.phone
                    ? <span style={{ fontSize:"13px", color:T.textMid, display:"flex", alignItems:"center", gap:"4px" }}><span style={{ color:T.textDim }}>{Ic.phone}</span>{lead.phone}</span>
                    : <span style={{ color:T.textDim, fontSize:"13px" }}>—</span>}
                </td>
                <td style={{ padding:"10px 16px" }}>
                  {lead.linkedin
                    ? <a href={lead.linkedin} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize:"13px", color:T.textMid, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"5px", padding:"3px 8px", borderRadius:"5px", border:`1px solid ${T.border}`, background:"transparent", transition:"all .12s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.borderHov; e.currentTarget.style.background = T.surfaceEl; }}
                        onMouseLeave={e => { e.currentTarget.style.color = T.textMid; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = "transparent"; }}>
                        {Ic.linkedin} View profile {Ic.ext}
                      </a>
                    : <span style={{ color:T.textDim, fontSize:"13px" }}>—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LeadsExportPanel — all export functionality (CSV/XLSX, filters, selection)
   ► Placed above the leads table in the Leads tab
   ► Self-contained: no changes to existing state or components
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function LeadsExportPanel({ taskId, allLeads, selectedIds, onFilterChange, activeFilters }) {
  const [fmt, setFmt]      = useState("csv");    // "csv" | "xlsx"
  const [open, setOpen]    = useState(false);    // filter drawer open

  /* ── helpers ──────────────────────────────────────────────────────────*/
  const ts = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}_${String(d.getHours()).padStart(2,"0")}-${String(d.getMinutes()).padStart(2,"0")}`;
  };

  const triggerDownload = (rows, filename) => {
    if (!rows.length) { alert("No leads to export."); return; }
    if (fmt === "xlsx") {
      /* ── simple XLSX via CSV-in-xlsx fallback (no lib needed) ───────── */
      const headers = ["company","location","email","phone","linkedin"];
      const csv = [headers.join(","), ...rows.map(r =>
        headers.map(h => `"${(r[h] || "").replace(/"/g,'""')}"`).join(",")
      )].join("\n");
      const blob = new Blob([csv], { type:"application/vnd.ms-excel" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = filename.replace(".csv",".xlsx"); a.click();
    } else {
      const headers = ["company","location","email","phone","linkedin"];
      const csv = [headers.join(","), ...rows.map(r =>
        headers.map(h => `"${(r[h] || "").replace(/"/g,'""')}"`).join(",")
      )].join("\n");
      const blob = new Blob([csv], { type:"text/csv" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = filename; a.click();
    }
  };

  /* ── Req 1: Export via backend (task-scoped) ──────────────────────────*/
  const exportFromBackend = () => {
    if (!taskId) { alert("No task selected. Run an agent task first."); return; }
    const ext = fmt === "xlsx" ? "xlsx" : "csv";
    const filename = `leads_task_${taskId}_${ts()}.${ext}`;
    const url = `${API_BASE}/leads/export?task_id=${encodeURIComponent(taskId)}`;
    // Use fetch + blob so we can set the filename with timestamp
    fetch(url).then(r => r.blob()).then(blob => {
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = filename; a.click();
    }).catch(() => window.open(url));
  };

  /* ── Req 2: Export selected ───────────────────────────────────────────*/
  const exportSelected = () => {
    if (!selectedIds.size) { alert("No leads selected. Check rows first."); return; }
    const rows = allLeads.filter((lead) => selectedIds.has(lead.id));
    triggerDownload(rows, `leads_selected_${ts()}.csv`);
  };

  /* ── Req 3: Export filtered ───────────────────────────────────────────*/
  const exportFiltered = () => {
    let rows = [...allLeads];
    if (activeFilters.hasEmail)    rows = rows.filter(l => l.email);
    if (activeFilters.hasLinkedin) rows = rows.filter(l => l.linkedin);
    triggerDownload(rows, `leads_filtered_${ts()}.csv`);
  };

  const btnBase = { display:"flex", alignItems:"center", gap:"5px", padding:"5px 11px", borderRadius:"6px", border:`1px solid ${T.border}`, background:"transparent", color:T.textMid, fontSize:"12px", fontWeight:500, fontFamily:"inherit", cursor:"pointer", transition:"all .12s ease" };
  const btnHover = e => { e.currentTarget.style.background = T.surfaceEl; e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.borderHov; };
  const btnLeave = e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMid; e.currentTarget.style.borderColor = T.border; };

  return (
    <div style={{ padding:"10px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", background:T.surface }}>

      {/* Format toggle: CSV | XLSX */}
      <div style={{ display:"flex", borderRadius:"6px", border:`1px solid ${T.border}`, overflow:"hidden", flexShrink:0 }}>
        {["csv","xlsx"].map(f => (
          <button key={f} onClick={() => setFmt(f)} style={{ padding:"4px 10px", border:"none", borderRight: f === "csv" ? `1px solid ${T.border}` : "none", background: fmt===f ? T.surfaceEl : "transparent", color: fmt===f ? T.text : T.textDim, fontSize:"11px", fontWeight:500, fontFamily:"inherit", cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.04em" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Req 1: Export task leads (backend) */}
      <button style={{...btnBase, borderColor: taskId ? T.accent : T.border, color: taskId ? T.accentLt : T.textDim }}
        onClick={exportFromBackend}
        onMouseEnter={e => { e.currentTarget.style.background = T.accentDim; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        {Ic.download} Export Task
      </button>

      {/* Req 2: Export selected rows */}
      <button style={{...btnBase, opacity: selectedIds.size ? 1 : 0.5 }}
        onClick={exportSelected} onMouseEnter={btnHover} onMouseLeave={btnLeave}
      >
        {Ic.download} Export Selected {selectedIds.size > 0 && `(${selectedIds.size})`}
      </button>

      {/* Filter toggle + Req 3: Export filtered */}
      <button style={{...btnBase, background: open ? T.surfaceEl : "transparent", borderColor: open ? T.borderHov : T.border }}
        onClick={() => setOpen(o => !o)} onMouseEnter={btnHover} onMouseLeave={btnLeave}
      >
        {Ic.filter} Filters {(activeFilters.hasEmail || activeFilters.hasLinkedin) && <span style={{ color:T.amber, fontSize:"10px" }}>●</span>}
      </button>

      {open && (
        <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"6px 12px", borderRadius:"8px", background:T.surfaceEl, border:`1px solid ${T.border}` }}>
          <label style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color:T.textMid, cursor:"pointer" }}>
            <input type="checkbox" checked={activeFilters.hasEmail} onChange={e => onFilterChange("hasEmail", e.target.checked)}
              style={{ accentColor: T.accent }} />
            Has Email
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", color:T.textMid, cursor:"pointer" }}>
            <input type="checkbox" checked={activeFilters.hasLinkedin} onChange={e => onFilterChange("hasLinkedin", e.target.checked)}
              style={{ accentColor: T.accent }} />
            Has LinkedIn
          </label>
          <button style={{...btnBase, padding:"3px 9px", fontSize:"11px" }}
            onClick={exportFiltered} onMouseEnter={btnHover} onMouseLeave={btnLeave}
          >
            {Ic.download} Export Filtered
          </button>
        </div>
      )}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LeadsTableWithSelection — extends LeadsTable with checkboxes
   ► Identical rendering to LeadsTable; only adds a checkbox column
   ► selectedIds / setSelectedIds lifted to parent (leads tab)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function LeadsTableWithSelection({ leads, selectedIds, setSelectedIds, activeFilters }) {
  const [hov, setHov] = useState(null);

  // Apply active filters then reverse for newest-first
  let filtered = [...leads];
  if (activeFilters.hasEmail)    filtered = filtered.filter(l => l.email);
  if (activeFilters.hasLinkedin) filtered = filtered.filter(l => l.linkedin);
  const ordered = [...leads].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  const allChecked = ordered.length > 0 && ordered.every((lead) => selectedIds.has(lead.id));
  const toggleAll  = () => {
    if (allChecked) setSelectedIds(new Set());
    else            setSelectedIds(new Set(ordered.map((lead) => lead.id)));
  };
  const toggle = (lead) => {
    const next = new Set(selectedIds);
    next.has(lead.id) ? next.delete(lead.id) : next.add(lead.id);
    setSelectedIds(next);
  };

  if (!ordered.length) return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:T.textDim, gap:"8px", padding:"60px 24px" }}>
      <span style={{ fontSize:"24px", opacity:0.3 }}>◈</span>
      <span style={{ fontSize:"13px", color:T.textMid }}>
        {(activeFilters.hasEmail || activeFilters.hasLinkedin) ? "No leads match the active filters" : "No leads found yet"}
      </span>
    </div>
  );

  return (
    <div style={{ flex:1, overflowY:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead style={{ position:"sticky", top:0, zIndex:5, background:T.surface }}>
          <tr style={{ borderBottom:`1px solid ${T.border}` }}>
            {/* Select-all checkbox */}
            <th style={{ padding:"9px 12px", width:"36px" }}>
              <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ accentColor:T.accent, cursor:"pointer" }} />
            </th>
            {[{label:"Company",w:"21%"},{label:"Location",w:"16%"},{label:"Email",w:"24%"},{label:"Phone",w:"15%"},{label:"LinkedIn",w:"20%"}].map(c => (
              <th key={c.label} style={{ padding:"9px 16px", textAlign:"left", fontSize:"11px", fontWeight:500, color:T.textDim, letterSpacing:"0.04em", textTransform:"uppercase", width:c.w }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordered.map((lead, i) => {
            const color   = avatarColor(lead.company || "");
            const init    = (lead.company || "?")[0].toUpperCase();
            const isH     = hov === i;
            const checked = selectedIds.has(lead.id);
            return (
              <tr key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                style={{ background: checked ? "rgba(91,91,214,0.06)" : isH ? T.surfaceEl : "transparent", borderBottom:`1px solid ${T.border}`, transition:"background .1s ease", animation:"_fi .35s ease both", animationDelay:`${i * 0.03}s` }}>
                <td style={{ padding:"10px 12px" }}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(lead)} style={{ accentColor:T.accent, cursor:"pointer" }} />
                </td>
                <td style={{ padding:"10px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:24, height:24, borderRadius:"6px", background:`${color}20`, color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:700, flexShrink:0, border:`1px solid ${color}30` }}>{init}</div>
                    <span style={{ fontSize:"13px", fontWeight:500, color:T.text }}>{lead.company || "—"}</span>
                  </div>
                </td>
                <td style={{ padding:"10px 16px" }}>
                  {lead.location
                    ? <span style={{ fontSize:"13px", color:T.textMid, display:"flex", alignItems:"center", gap:"4px" }}><span style={{ color:T.textDim }}>{Ic.pin}</span>{lead.location}</span>
                    : <span style={{ color:T.textDim, fontSize:"13px" }}>—</span>}
                </td>
                <td style={{ padding:"10px 16px" }}>
                  {lead.email
                    ? <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                        <a href={`mailto:${lead.email}`} style={{ fontSize:"13px", color:T.accentLt, textDecoration:"none", display:"flex", alignItems:"center", gap:"4px", flex:1, minWidth:0 }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                          <span style={{ color:T.textDim }}>{Ic.mail}</span>
                          <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:150 }}>{lead.email}</span>
                        </a>
                        <CopyEmailButton email={lead.email} />
                      </div>
                    : <NoEmailBadge />}
                </td>
                <td style={{ padding:"10px 16px" }}>
                  {lead.phone
                    ? <span style={{ fontSize:"13px", color:T.textMid, display:"flex", alignItems:"center", gap:"4px" }}><span style={{ color:T.textDim }}>{Ic.phone}</span>{lead.phone}</span>
                    : <span style={{ color:T.textDim, fontSize:"13px" }}>—</span>}
                </td>
                <td style={{ padding:"10px 16px" }}>
                  {lead.linkedin
                    ? <a href={lead.linkedin} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize:"13px", color:T.textMid, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"5px", padding:"3px 8px", borderRadius:"5px", border:`1px solid ${T.border}`, background:"transparent", transition:"all .12s ease" }}
                        onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.borderHov; e.currentTarget.style.background = T.surfaceEl; }}
                        onMouseLeave={e => { e.currentTarget.style.color = T.textMid; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = "transparent"; }}>
                        {Ic.linkedin} View profile {Ic.ext}
                      </a>
                    : <span style={{ color:T.textDim, fontSize:"13px" }}>—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── SectionHeader (unchanged) ──────────────────────────────────────────*/
function SectionHeader({ label, icon, count, live, taskId }) {
  return (
    <div style={{ padding:"10px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
      <span style={{ color:T.textDim, display:"flex" }}>{icon}</span>
      <span style={{ fontSize:"12px", fontWeight:500, color:T.textMid, flex:1 }}>{label}</span>
      {taskId && <TaskBadge taskId={taskId} />}
      {count > 0 && <span style={{ fontSize:"11px", color:T.textDim, background:T.bg, border:`1px solid ${T.border}`, padding:"1px 6px", borderRadius:"4px" }}>{count}</span>}
      {live && <span style={{ fontSize:"11px", color:T.amber, display:"flex", alignItems:"center", gap:"4px" }}>{Ic.spin} live</span>}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Overview — FIXED layout order:
   1. Agent Input
   2. Run Summary  (task-scoped)
   3. Agent Output Panel  (task-scoped, newest first)
   4. Stats  (task-scoped counts)
   5. Leads Table  (task-scoped, newest first)
   6. Activity Panel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function Overview({ leads, allLeads,totalStats, activity, status, task, setTask, onRun, loading, lastTask, taskId ,queryMeta}) {
  // Stats use allLeads (all historical data)
  const allEmailCount    = allLeads.filter(l => l.email).length;
  const allLinkedinCount = allLeads.filter(l => l.linkedin).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* 1 ── Agent Input */}
      <CommandInput task={task} setTask={setTask} onRun={onRun} loading={loading} />

      {/* Progress bar */}
      <ProgressBar active={status === "running"} />

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:"auto" }}>

        {/* 2 ── Run Summary (task-scoped) */}
        <LastRunSummary leads={leads} status={status} taskDescription={lastTask} taskId={taskId} />
        <QueryInsightBanner meta={queryMeta} />

        {/* 3 ── Agent Output Panel (task-scoped, newest first) */}
        <AgentOutputPanel leads={leads} status={status} taskId={taskId} />

        {/* Divider */}
        <div style={{ margin:"0 22px 14px", borderTop:`1px solid ${T.border}` }}/>

        {/* 4 ── Stats — always reflect ALL historical data (allLeads) */}
        <div style={{ padding:"0 22px 16px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"8px" }}>
          <Stat label="Leads"    value={totalStats.totalLeads}    sub="all time"     color={T.text}     />
          <Stat label="Emails"   value={totalStats.totalEmails}      sub="all time"     color={T.green}    />
          <Stat label="LinkedIn" value={totalStats.totalLinkedin}   sub="all time"     color={T.accentLt} />
          <Stat label="Events"   value={activity.length}    sub="agent events" color={T.text}     />
        </div>

        {/* 5 ── Leads Table (allLeads — full history, newest first) + 6 ── Activity */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", borderTop:`1px solid ${T.border}`, minHeight:280 }}>
          <div style={{ display:"flex", flexDirection:"column", borderRight:`1px solid ${T.border}` }}>
            <SectionHeader label="All Leads — newest first" icon={Ic.leads} count={allLeads.length} />
            <LeadsTable leads={allLeads} />
          </div>
          <div style={{ display:"flex", flexDirection:"column" }}>
            <SectionHeader label="Live Activity" icon={Ic.activity} live={status === "running"} />
            <ActivityFeed items={activity} status={status} compact />
          </div>
        </div>

      </div>
    </div>
  );
}
function QueryInsightBanner({ meta }) {
  if (!meta || meta.type !== "UNREALISTIC") return null;
  return (
    <div style={{ margin:"0 22px 12px", padding:"12px 16px", borderRadius:"8px",
      background:T.amberDim, border:"1px solid rgba(245,166,35,0.25)",
      color:T.amber, display:"flex", alignItems:"flex-start", gap:"10px",
      animation:"_fi .25s ease" }}>
      <span style={{ flexShrink:0, fontSize:"14px" }}>⚠️</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <strong style={{ fontSize:"13px", fontWeight: 600, color: "#fff" }}>
          Unrealistic Search Parameters
        </strong>
        <span style={{ fontSize:"12px", lineHeight: 1.5 }}>
          {meta.reason}. We could not find exact matches, so the AI has attempted to extract the closest similar leads available.
        </span>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LeadsTabWithExport — stateful wrapper for the Leads tab.
   Owns: selectedIds, activeFilters.
   Renders: existing header + ProgressBar + LastRunSummary (unchanged) +
            NEW ExportPanel + NEW table-with-selection.
   The original "tab === leads" inline JSX is replaced by this component.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
function LeadsTabWithExport({ allLeads, leads, status, taskId, lastTask,totalStats }) {
  const [selectedIds,   setSelectedIds]   = useState(new Set());
  const [activeFilters, setActiveFilters] = useState({ hasEmail: false, hasLinkedin: false });

  const handleFilterChange = (key, val) =>
    setActiveFilters(prev => ({ ...prev, [key]: val }));

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* ── Header (identical to previous implementation) ───────────────*/}
      <div style={{ padding:"18px 22px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h2 style={{ fontSize:"16px", fontWeight:600, color:T.text, letterSpacing:"-0.02em" }}>Leads</h2>
          <p style={{ fontSize:"12px", color:T.textMid, marginTop:"2px" }}>
            {totalStats.totalLeads > 0
              ? `${totalStats.totalLeads} leads in database · ${totalStats.totalEmails} with email`
              : "No leads yet — run an agent task"}
          </p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          {taskId && <TaskBadge taskId={taskId} />}
          <AgentStatusBadge status={status} />
          {totalStats.totalLeads > 0 && (
            <span style={{ display:"flex", alignItems:"center", gap:"5px", padding:"4px 10px", borderRadius:"6px", background:T.greenDim, border:"1px solid rgba(48,164,108,0.2)", fontSize:"12px", color:T.green, fontWeight:500 }}>
              {Ic.check} {totalStats.totalEmails} with email
            </span>
          )}
        </div>
      </div>

      <ProgressBar active={status === "running"} />

      {/* ── Run summary (unchanged) ─────────────────────────────────────*/}
      {status === "completed" && leads.length > 0 && (
        <div style={{ padding:"12px 22px 0" }}>
          <LastRunSummary leads={leads} status={status} taskDescription={lastTask} taskId={taskId} />
        </div>
      )}

      {/* ── NEW: Export panel ────────────────────────────────────────────*/}
      <LeadsExportPanel
        taskId={taskId}
        allLeads={allLeads}
        selectedIds={selectedIds}
        onFilterChange={handleFilterChange}
        activeFilters={activeFilters}
      />

      {/* ── NEW: Table with checkboxes + filter support ──────────────────*/}
      <LeadsTableWithSelection
        leads={allLeads}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        activeFilters={activeFilters}
      />
    </div>
  );
}

/* ─── Settings (unchanged) ───────────────────────────────────────────────*/
function Settings() {
  const rows = [
    { label:"API Endpoint",  value:API_BASE,   hint:"Django backend URL"          },
    { label:"Poll Interval", value:"2 000 ms", hint:"Activity refresh rate"       },
    { label:"LLM Planner",   value:"Gemini",   hint:"Planning & reasoning model"  },
    { label:"Browser Agent", value:"TinyFish", hint:"Autonomous browser engine"   },
    { label:"Storage",       value:"SQLite",   hint:"Local database"              },
  ];
  return (
    <div style={{ padding:"22px" }}>
      <h2 style={{ fontSize:"16px", fontWeight:600, color:T.text, letterSpacing:"-0.02em", marginBottom:"3px" }}>Settings</h2>
      <p style={{ fontSize:"13px", color:T.textMid, marginBottom:"22px" }}>LeadForge agent configuration</p>
      <div style={{ background:T.surfaceEl, border:`1px solid ${T.border}`, borderRadius:"10px", overflow:"hidden" }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <div>
              <div style={{ fontSize:"13px", fontWeight:500, color:T.text }}>{r.label}</div>
              <div style={{ fontSize:"12px", color:T.textDim, marginTop:"2px" }}>{r.hint}</div>
            </div>
            <div style={{ padding:"4px 10px", borderRadius:"6px", background:T.bg, border:`1px solid ${T.border}`, fontSize:"12px", color:T.textMid, fontFamily:"'Geist Mono', monospace" }}>
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   App — KEY CHANGES:
   • taskId state — stored from each run-agent response
   • fetchLeads uses /leads?task_id=<taskId> when available
   • fetchActivity unchanged (still /tasks/activity)
   • leads state always contains ONLY current task's leads
   • runAgent: clears leads + taskId before each run, then stores new taskId
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*/
export default function App() {
  const [task,     setTask]     = useState("");
  const [queryMeta, setQueryMeta] = useState({ type: "REALISTIC", reason: "" });
  const [status,   setStatus]   = useState("idle");
  const [activity, setActivity] = useState([]);
  const [leads,    setLeads]    = useState([]);   // ONLY current task results
  const [allLeads, setAllLeads] = useState([]);   // ALL historical leads from DB
  const [loading,  setLoading]  = useState(false);
  const [tab,      setTab]      = useState("overview");
  const [lastTask, setLastTask] = useState("");    // description of last submitted query
  const [taskId,   setTaskId]   = useState(null); // task_id from backend
  const [tasks,    setTasks]    = useState([]);   // task history list

  const [totalStats, setTotalStats] = useState({
  totalLeads: 0,
  totalEmails: 0,
  totalLinkedin: 0
});

  const poll = useRef(null);

  /* ── fetchActivity: unchanged endpoint ─────────────────────────────── */
  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks/activity`);
      if (!res.ok) return;
      const data = await res.json();
      setActivity(data);
    } catch (err) {
      console.error("Activity error:", err);
    }
  }, []);

  /* ── fetchLeads: task-scoped + full history in parallel ─────────────── */
  const fetchLeads = useCallback(async (tid) => {
    try {
      // ── Current task leads (task-scoped) ──────────────────────────────
      if (tid) {
        const taskRes = await fetch(`${API_BASE}/leads?task_id=${encodeURIComponent(tid)}`);
        if (taskRes.ok) {
          const taskData = await taskRes.json();
          setLeads(taskData);
        }
      }

      // ── All historical leads (always fetched, never cleared on new run) ─
      const allRes = await fetch(`${API_BASE}/leads`);
      if (allRes.ok) {
        const allData = await allRes.json();
        setTotalStats({
      totalLeads: allData.length,
      totalEmails: allData.filter(l => l.email).length,
      totalLinkedin: allData.filter(l => l.linkedin).length
    });
        // Descending by id — newest first; limit to 50 for performance
        const sorted = [...allData].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
        setAllLeads(sorted.slice(0, 50));
      }
    } catch (err) {
      console.error("Leads error:", err);
    }
  }, []);

  /* ── Polling: pass current taskId into fetchLeads ───────────────────── */
  useEffect(() => {
    if (status === "running") {
      poll.current = setInterval(() => {
        fetchActivity();
        fetchLeads(taskId); // CHANGE: always poll with current taskId
      }, 2000);
    } else {
      clearInterval(poll.current);
    }
    return () => clearInterval(poll.current);
  }, [status, taskId, fetchActivity, fetchLeads]);

  /* ── fetchTasks: load history from /tasks (newest first, max 20) ─────── */
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks/`);
      if (!res.ok) return;
      const data = await res.json();
      const safe   = Array.isArray(data) ? data : (data.results || data.tasks || []);
      const sorted = [...safe].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 20);
      setTasks(sorted);
    } catch (err) {
      console.error("Tasks fetch error:", err);
    }
  }, []);

  /* ── Load tasks + allLeads on first render ───────────────────────────── */
  useEffect(() => {
    fetchTasks();
    fetchLeads();
  }, [fetchTasks, fetchLeads]);

  /* ── onSelectTask: click history item → load its scoped leads ────────── */
  const onSelectTask = useCallback((t) => {
    setTaskId(t.id);
    setLastTask(t.description || t.task || "");
    fetchLeads(t.id);
    setTab("overview");
  }, [fetchLeads]);

  /* ── runAgent: CHANGE — resets state, captures task_id from response ── */
  const runAgent = async () => {
    if (!task.trim()) return;

    // Clear current-task state for a fresh run — allLeads is intentionally kept
    setLastTask(task);
    setLeads([]);          // reset current task results
    // NOTE: allLeads is NOT cleared — history remains visible during the run
    setActivity([]);       // clear activity for clean feed
    setTaskId(null);       // clear old task_id
    setLoading(true);
    setStatus("running");

    try {
      const res = await fetch(`${API_BASE}/tasks/run-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: task }),
      });

      const response = await res.json();
      console.log("API RESPONSE:", response);
      setQueryMeta({
      type:   response.query_type   || "REALISTIC",
      reason: response.query_reason || "",
      });

      // CHANGE: capture task_id from response for scoped polling
      const newTaskId = response.task_id || response.id || null;
      if (newTaskId) {
        setTaskId(newTaskId);
        console.log("Task ID captured:", newTaskId);
      }
     

      if (response.result) {
        setLoading(false);
        setStatus("completed");
        // Final fetch with definitive task_id
        fetchLeads(newTaskId || taskId);
        fetchActivity();
        fetchTasks(); // refresh sidebar history so new task appears immediately
      }

    } catch (err) {
      console.error("Run error:", err);
      setLoading(false);
      setStatus("error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100vh;overflow:hidden}
        body{background:${T.bg};font-family:'Geist',ui-sans-serif,system-ui,sans-serif;color:${T.text}}
        textarea::placeholder{color:${T.textDim}}
        input::placeholder{color:${T.textDim}}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        @keyframes _spin     { to { transform: rotate(360deg); } }
        @keyframes _blink    { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes _fi       { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        @keyframes _progress { 0%{transform:translateX(-100%)} 50%{transform:translateX(150%)} 100%{transform:translateX(400%)} }
      `}</style>

      <div style={{ display:"flex", height:"100vh", background:T.bg }}>
        <Sidebar tab={tab} setTab={setTab} nLeads={totalStats.totalLeads} nEvents={activity.length} status={status} tasks={tasks} taskId={taskId} onSelectTask={onSelectTask} />

        <main style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:T.surface }}>
          <TopBar nLeads={totalStats.totalLeads} status={status} taskId={taskId} />

          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>

            {tab === "overview" && (
              <Overview
                leads={leads}
                allLeads={allLeads}
                totalStats={totalStats}
                activity={activity}
                status={status}
                task={task}
                setTask={setTask}
                onRun={runAgent}
                loading={loading}
                lastTask={lastTask}
                taskId={taskId}
                queryMeta={queryMeta}
              />
            )}

            {tab === "activity" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                <div style={{ padding:"18px 22px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <h2 style={{ fontSize:"16px", fontWeight:600, color:T.text, letterSpacing:"-0.02em" }}>Activity Feed</h2>
                    <p style={{ fontSize:"12px", color:T.textMid, marginTop:"2px" }}>Real-time events from the AI agent</p>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    {taskId && <TaskBadge taskId={taskId} />}
                    <AgentStatusBadge status={status} />
                  </div>
                </div>
                <ProgressBar active={status === "running"} />
                <ActivityFeed items={activity} status={status} />
              </div>
            )}

            {tab === "leads" && (
              <LeadsTabWithExport
                allLeads={allLeads}
                leads={leads}
                status={status}
                taskId={taskId}
                lastTask={lastTask}
                totalStats={totalStats}
              />
            )}

            {tab === "settings" && <Settings />}
          </div>
        </main>
      </div>
    </>
  );
}