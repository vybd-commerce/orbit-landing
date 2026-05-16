import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ControlPage.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Agent {
  id: number;
  name: string;
  capability_description: string;
  mode: "live" | "stub";
  partner: string;
  created_at: string;
}

// SSE event union
type StreamEvent =
  | { type: "connecting"; message: string }
  | { type: "classifying"; message: string }
  | { type: "classified"; intent: string }
  | { type: "decomposing"; message: string }
  | { type: "decomposed"; subtasks: { subtask: string; capability: string }[] }
  | { type: "routing"; index: number; subtask: string; capability: string }
  | { type: "routed"; index: number; subtask: string; agent_name: string; score: number; reasoning: string }
  | { type: "executing"; index: number; agent_name: string; mode: string }
  | { type: "response"; index: number; agent_name: string; response: string; latency_ms: number }
  | { type: "aggregating"; message: string }
  | { type: "complete"; final_answer: string }
  | { type: "error"; message: string };

// A rendered log line derived from events
interface LogLine {
  id: string;
  status: "running" | "done" | "error";
  icon: "spinner" | "check" | "cross" | "arrow" | "dot";
  label: string;
  detail?: string;
  badge?: string;
  indent?: boolean;
  dim?: boolean;
  highlight?: boolean; // final answer
}

interface DbOverview {
  counts: Record<string, number>;
  recent_routing_decisions: {
    id: number;
    task_id: number;
    subtask: string;
    agent: string;
    score: number;
    created_at: string;
  }[];
  recent_agent_responses: {
    id: number;
    task_id: number;
    agent: string;
    latency_ms: number;
    created_at: string;
  }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEED_TASKS = [
  "I need to land 5000 units of cotton towels in the US from India.",
  "Classify this SKU for EU import: organic cotton baby clothing.",
  "Find me a 3PL in Rotterdam that handles perishable goods.",
  "Help me set up US e-commerce for my Korean skincare brand.",
];

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// ─── Left Column — Partner Onboarding ────────────────────────────────────────

function PartnerOnboarding({ onAgentsChange }: { onAgentsChange: () => void }) {
  const [partnerName, setPartnerName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const [agentName, setAgentName] = useState("");
  const [capability, setCapability] = useState("");
  const [mode, setMode] = useState<"stub" | "live">("stub");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState<string | null>(null);

  const [agents, setAgents] = useState<Agent[]>([]);

  const fetchAgents = useCallback(async () => {
    try {
      const r = await fetch(`${API}/agents`);
      setAgents(await r.json());
    } catch {}
  }, []);

  useEffect(() => {
    fetchAgents();
    const id = setInterval(() => { fetchAgents(); onAgentsChange(); }, 3000);
    return () => clearInterval(id);
  }, [fetchAgents, onAgentsChange]);

  async function generateToken() {
    if (!partnerName.trim()) return;
    setGenerating(true);
    try {
      const r = await fetch(`${API}/partners/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: partnerName }),
      });
      const data = await r.json();
      setToken(data.token);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  async function registerAgent() {
    if (!token || !agentName.trim() || !capability.trim()) return;
    if (mode === "stub" && !systemPrompt.trim()) return;
    if (mode === "live" && !endpointUrl.trim()) return;
    setRegistering(true);
    try {
      const body: Record<string, string> = {
        name: agentName,
        capability_description: capability,
        mode,
      };
      if (mode === "stub") body.system_prompt = systemPrompt;
      if (mode === "live") body.endpoint_url = endpointUrl;

      const r = await fetch(`${API}/agents/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      setRegistered(data.name);
      setAgentName("");
      setCapability("");
      setSystemPrompt("");
      setEndpointUrl("");
      fetchAgents();
      onAgentsChange();
    } catch (e) {
      console.error(e);
    } finally {
      setRegistering(false);
    }
  }

  const truncateToken = (t: string) =>
    t.slice(0, 14) + "••••" + t.slice(-4);

  return (
    <div className="cp-col cp-col-left">
      <div className="cp-col-header">
        <span className="cp-col-label">Partner Onboarding</span>
      </div>

      {/* Token generation */}
      <div className="cp-card">
        <div className="cp-card-title">Generate partner token</div>
        <div className="cp-field-row">
          <input
            className="cp-input"
            placeholder="Partner name"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateToken()}
          />
          <button
            className="cp-btn cp-btn-primary"
            onClick={generateToken}
            disabled={generating || !partnerName.trim()}
          >
            {generating ? "..." : "Generate"}
          </button>
        </div>
        {token && (
          <div className="cp-token-display">
            <span className="cp-token-label">Token (shown once)</span>
            <code className="cp-token-value">{truncateToken(token)}</code>
            <div className="cp-token-snippet">
              <pre>{`Authorization: Bearer ${truncateToken(token)}`}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Agent registration */}
      {token && (
        <div className="cp-card">
          <div className="cp-card-title">Register agent</div>
          {registered && (
            <div className="cp-success-banner">
              ✓ <strong>{registered}</strong> joined the registry
            </div>
          )}
          <input
            className="cp-input cp-input-full"
            placeholder="Agent name"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          />
          <textarea
            className="cp-input cp-input-full cp-textarea"
            placeholder="Capability description"
            rows={2}
            value={capability}
            onChange={(e) => setCapability(e.target.value)}
          />
          <div className="cp-mode-toggle">
            <button
              className={`cp-mode-btn ${mode === "stub" ? "active" : ""}`}
              onClick={() => setMode("stub")}
            >
              Stub (describe)
            </button>
            <button
              className={`cp-mode-btn ${mode === "live" ? "active" : ""}`}
              onClick={() => setMode("live")}
            >
              Live (endpoint)
            </button>
          </div>
          {mode === "stub" ? (
            <textarea
              className="cp-input cp-input-full cp-textarea"
              placeholder="System prompt — how should this agent behave?"
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          ) : (
            <input
              className="cp-input cp-input-full"
              placeholder="https://your-agent.com/query"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
            />
          )}
          <button
            className="cp-btn cp-btn-primary cp-btn-full"
            onClick={registerAgent}
            disabled={registering}
          >
            {registering ? "Registering..." : "Register agent"}
          </button>
        </div>
      )}

      {/* Live registry */}
      <div className="cp-card cp-card-registry">
        <div className="cp-card-title">
          Live registry
          <span className="cp-pulse" />
        </div>
        {agents.length === 0 ? (
          <div className="cp-empty">No agents registered yet.</div>
        ) : (
          <div className="cp-agent-list">
            {agents.map((a) => (
              <div key={a.id} className="cp-agent-row">
                <div className="cp-agent-name">{a.name}</div>
                <div className="cp-agent-cap">{a.capability_description}</div>
                <div className="cp-agent-meta">
                  <span className={`cp-mode-tag cp-mode-${a.mode}`}>{a.mode}</span>
                  <span className="cp-agent-partner">{a.partner}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Log line renderer ────────────────────────────────────────────────────────

function LogLineView({ line }: { line: LogLine }) {
  return (
    <div className={`ll ${line.indent ? "ll-indent" : ""} ${line.highlight ? "ll-highlight" : ""} ll-enter`}>
      <span className={`ll-icon ll-icon-${line.icon} ${line.status === "running" ? "ll-spin" : ""}`}>
        {line.icon === "spinner" ? <span className="ll-spinner-frames" /> :
         line.icon === "check"   ? "✓" :
         line.icon === "cross"   ? "✗" :
         line.icon === "arrow"   ? "→" :
                                   "·"}
      </span>
      <span className={`ll-body ${line.dim ? "ll-dim" : ""}`}>
        <span className="ll-label" dangerouslySetInnerHTML={{ __html: line.label }} />
        {line.badge && <span className={`ll-badge ll-badge-${line.badge}`}>{line.badge}</span>}
        {line.detail && <span className="ll-detail">{line.detail}</span>}
      </span>
    </div>
  );
}

// ─── Center Column — Task Submission ─────────────────────────────────────────

function TaskSubmission() {
  const location = useLocation();
  const prefilledTask = (location.state as { task?: string } | null)?.task ?? "";

  const [input, setInput] = useState(prefilledTask);
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [lines, setLines] = useState<LogLine[]>([]);
  const esRef = useRef<EventSource | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const lineId = useRef(0);
  const autoSubmitted = useRef(false);

  function nextId() {
    return String(++lineId.current);
  }

  function addLine(line: Omit<LogLine, "id">) {
    setLines((prev) => [...prev, { ...line, id: nextId() }]);
  }

  function updateLastOfType(type: string, update: Partial<LogLine>) {
    setLines((prev) => {
      const idx = [...prev].reverse().findIndex((l) => l.id.startsWith(type + ":"));
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      const updated = [...prev];
      updated[realIdx] = { ...updated[realIdx], ...update };
      return updated;
    });
  }

  // Auto-scroll log to bottom as lines arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [lines]);

  function closeStream() {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  }

  useEffect(() => () => closeStream(), []);

  // Auto-submit when arriving from onboarding with a pre-built task
  useEffect(() => {
    if (prefilledTask && !autoSubmitted.current) {
      autoSubmitted.current = true;
      // Small delay so the component has painted before streaming starts
      const id = setTimeout(() => submitTask(prefilledTask), 300);
      return () => clearTimeout(id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleEvent(raw: string) {
    let ev: StreamEvent;
    try { ev = JSON.parse(raw); } catch { return; }

    switch (ev.type) {
      case "connecting":
        addLine({ id: "", status: "running", icon: "spinner", label: "Connecting to orchestrator" });
        break;
      case "classifying":
        setLines((prev) => prev.map((l) =>
          l.status === "running" ? { ...l, status: "done", icon: "check" } : l
        ));
        addLine({ id: "", status: "running", icon: "spinner", label: "Classifying intent" });
        break;
      case "classified":
        setLines((prev) => prev.map((l) =>
          l.status === "running" ? { ...l, status: "done", icon: "check", label: `Intent: <strong>${ev.intent}</strong>`, badge: ev.intent } : l
        ));
        break;
      case "decomposing":
        addLine({ id: "", status: "running", icon: "spinner", label: "Decomposing into sub-tasks" });
        break;
      case "decomposed":
        setLines((prev) => prev.map((l) =>
          l.status === "running"
            ? { ...l, status: "done", icon: "check", label: `Decomposed into ${ev.subtasks.length} sub-task${ev.subtasks.length > 1 ? "s" : ""}` }
            : l
        ));
        ev.subtasks.forEach((s) => {
          addLine({ id: "", status: "done", icon: "arrow", label: s.subtask, badge: s.capability, indent: true, dim: false });
        });
        break;
      case "routing":
        addLine({ id: "", status: "running", icon: "spinner", label: `Finding best agent for sub-task ${ev.index + 1}` });
        break;
      case "routed": {
        const scoreStr = ev.score != null ? ` <span class="ll-score">${ev.score.toFixed(2)}</span>` : "";
        setLines((prev) => prev.map((l) =>
          l.status === "running"
            ? { ...l, status: "done", icon: "check", label: `Routed to <strong>${ev.agent_name}</strong>${scoreStr}` }
            : l
        ));
        if (ev.reasoning) {
          addLine({ id: "", status: "done", icon: "dot", label: ev.reasoning, indent: true, dim: true });
        }
        break;
      }
      case "executing":
        addLine({ id: "", status: "running", icon: "spinner", label: `Calling <strong>${ev.agent_name}</strong>`, badge: ev.mode });
        break;
      case "response":
        setLines((prev) => prev.map((l) =>
          l.status === "running"
            ? { ...l, status: "done", icon: "check", label: `<strong>${ev.agent_name}</strong> responded`, detail: `${ev.latency_ms}ms` }
            : l
        ));
        addLine({ id: "", status: "done", icon: "dot", label: ev.response, indent: true, dim: true });
        break;
      case "aggregating":
        addLine({ id: "", status: "running", icon: "spinner", label: "Synthesizing final answer" });
        break;
      case "complete":
        setLines((prev) => prev.map((l) =>
          l.status === "running" ? { ...l, status: "done", icon: "check", label: "Synthesis complete" } : l
        ));
        addLine({ id: "", status: "done", icon: "check", label: ev.final_answer, highlight: true });
        setStreaming(false);
        setDone(true);
        closeStream();
        break;
      case "error":
        setLines((prev) => prev.map((l) =>
          l.status === "running" ? { ...l, status: "error", icon: "cross" } : l
        ));
        addLine({ id: "", status: "error", icon: "cross", label: ev.message });
        setStreaming(false);
        closeStream();
        break;
    }
  }

  async function submitTask(override?: string) {
    const taskText = override ?? input;
    if (!taskText.trim() || streaming) return;
    closeStream();
    setLines([]);
    setDone(false);
    setStreaming(true);

    try {
      const r = await fetch(`${API}/tasks/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_input: taskText }),
      });
      const { task_id } = await r.json();

      const es = new EventSource(`${API}/tasks/${task_id}/stream`);
      esRef.current = es;

      es.onmessage = (e) => handleEvent(e.data);
      es.addEventListener("done", () => {
        es.close();
        esRef.current = null;
        setStreaming(false);
      });
      es.onerror = () => {
        es.close();
        esRef.current = null;
        setStreaming(false);
      };
    } catch (e) {
      console.error(e);
      setStreaming(false);
    }
  }

  return (
    <div className="cp-col cp-col-center">
      <div className="cp-col-header">
        <span className="cp-col-label">Task Orchestration</span>
        {streaming && <span className="cp-pulse" />}
      </div>

      <div className="cp-card">
        <div className="cp-card-title">Submit a brand task</div>
        <div className="cp-seed-chips">
          {SEED_TASKS.map((t) => (
            <button key={t} className="cp-chip" onClick={() => setInput(t)}>
              {t.slice(0, 52)}…
            </button>
          ))}
        </div>
        <textarea
          className="cp-input cp-input-full cp-textarea cp-textarea-lg"
          placeholder="Describe your cross-border commerce task in natural language…"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="cp-btn cp-btn-primary cp-btn-full"
          onClick={() => submitTask()}
          disabled={streaming || !input.trim()}
        >
          {streaming ? <><span className="cp-spinner-inline" /> Orchestrating…</> : "Submit task →"}
        </button>
      </div>

      {/* Live log */}
      {lines.length > 0 && (
        <div className="cp-log-card">
          <div className="cp-log-header">
            <span className="cp-log-title">Pipeline</span>
            {done && <span className="cp-log-done">complete</span>}
            {streaming && <span className="cp-log-running"><span className="cp-pulse" /> running</span>}
          </div>
          <div className="cp-log-body" ref={logRef}>
            {lines.map((line) => (
              <LogLineView key={line.id} line={line} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Right Column — Data Layer ────────────────────────────────────────────────

function DataLayer() {
  const [db, setDb] = useState<DbOverview | null>(null);

  useEffect(() => {
    async function fetchDb() {
      try {
        const r = await fetch(`${API}/admin/db`);
        setDb(await r.json());
      } catch {}
    }
    fetchDb();
    const id = setInterval(fetchDb, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="cp-col cp-col-right">
      <div className="cp-col-header">
        <span className="cp-col-label">Data Layer</span>
        <span className="cp-pulse" />
      </div>

      {/* Row counts */}
      <div className="cp-card">
        <div className="cp-card-title">Table counts</div>
        {db ? (
          <div className="cp-counts">
            {Object.entries(db.counts).map(([table, count]) => (
              <div key={table} className="cp-count-row">
                <span className="cp-count-table">{table}</span>
                <span className="cp-count-value">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="cp-empty">Connecting…</div>
        )}
      </div>

      {/* Recent routing decisions */}
      <div className="cp-card">
        <div className="cp-card-title">Recent routing decisions</div>
        {db && db.recent_routing_decisions.length > 0 ? (
          <div className="cp-data-rows">
            {db.recent_routing_decisions.map((r) => (
              <div key={r.id} className="cp-data-row">
                <div className="cp-data-primary">{r.subtask}</div>
                <div className="cp-data-meta">
                  → {r.agent}
                  {r.score != null && (
                    <span className="cp-score"> · {r.score.toFixed(2)}</span>
                  )}
                  <span className="cp-time"> · {timeAgo(r.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cp-empty">No routing decisions yet.</div>
        )}
      </div>

      {/* Recent agent responses */}
      <div className="cp-card">
        <div className="cp-card-title">Recent agent responses</div>
        {db && db.recent_agent_responses.length > 0 ? (
          <div className="cp-data-rows">
            {db.recent_agent_responses.map((r) => (
              <div key={r.id} className="cp-data-row">
                <div className="cp-data-primary">{r.agent}</div>
                <div className="cp-data-meta">
                  task #{r.task_id} · {r.latency_ms}ms
                  <span className="cp-time"> · {timeAgo(r.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cp-empty">No responses yet.</div>
        )}
      </div>

      <div className="cp-data-tagline">
        Every routing decision is logged. This is how we learn which agents to trust.
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ControlPage() {
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  return (
    <div className="control-page">
      <header className="cp-header">
        <div className="cp-header-inner">
          <a href="/" className="cp-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#1ab394" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="#1ab394" />
              <circle cx="12" cy="4" r="2" fill="#1ab394" opacity="0.5" />
              <circle cx="20" cy="12" r="2" fill="#1ab394" opacity="0.5" />
              <circle cx="4" cy="12" r="2" fill="#1ab394" opacity="0.5" />
            </svg>
            Vybd Control Plane
          </a>
          <div className="cp-header-badges">
            <span className="cp-env-badge">LIVE</span>
            <span className="cp-model-badge">claude-opus-4-7</span>
          </div>
        </div>
      </header>

      <main className="cp-main">
        <PartnerOnboarding onAgentsChange={refresh} />
        <TaskSubmission />
        <DataLayer />
      </main>
    </div>
  );
}
