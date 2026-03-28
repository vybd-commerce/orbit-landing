import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Check,
  TrendingUp,
  Search,
  ShieldCheck,
  Truck,
  Warehouse as WarehouseIcon,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';

/* ─── Types ─── */
type Phase = 'typing' | 'orchestrating' | 'results' | 'dashboard';

interface AgentDef {
  id: string;
  icon: React.ReactNode;
  label: string;
  emoji: string;
  color: string;
}

/* ─── Agent definitions ─── */
const AGENTS: AgentDef[] = [
  { id: 'market',     icon: <Search size={16} />,       label: 'Market Intelligence',  emoji: '🔍', color: '#6366f1' },
  { id: 'compliance', icon: <ShieldCheck size={16} />,   label: 'Compliance',           emoji: '🛡️', color: '#f59e0b' },
  { id: 'logistics',  icon: <Truck size={16} />,         label: 'Logistics',            emoji: '🚚', color: '#06b6d4' },
  { id: 'warehouse',  icon: <WarehouseIcon size={16} />, label: 'Warehousing',          emoji: '🏭', color: '#8b5cf6' },
  { id: 'ecommerce',  icon: <ShoppingCart size={16} />,  label: 'E-commerce',           emoji: '🛒', color: '#ec4899' },
  { id: 'marketing',  icon: <Sparkles size={16} />,      label: 'Marketing',            emoji: '📈', color: '#f97316' },
];

/* ─── Agent result content ─── */
const AGENT_RESULTS: Record<string, {
  lines: { label: string; value: string; status?: 'ok' | 'warn' | 'trend'; }[];
  quote: string;
}> = {
  market: {
    lines: [
      { label: 'Turmeric Supplements', value: '$4.2M TAM', status: 'trend' },
      { label: 'Herbal Face Serums',   value: '$2.8M TAM', status: 'trend' },
      { label: 'Target Geos',          value: 'CA · TX · NY' },
      { label: 'Channels',             value: 'Amazon · Shopify · Walmart' },
    ],
    quote: 'Your category is growing 38% YoY in the US. Here\'s where to start.',
  },
  compliance: {
    lines: [
      { label: 'FDA OTC Registration',    value: 'Pre-filled & ready', status: 'ok' },
      { label: 'FTC Labeling Compliance',  value: '3 edits suggested',  status: 'ok' },
      { label: 'California Prop 65',       value: 'Action required',    status: 'warn' },
    ],
    quote: 'I\'ve pre-filled your FDA registration. You just need to review and sign.',
  },
  logistics: {
    lines: [
      { label: 'Route',          value: 'Mumbai → LAX → Ontario, CA' },
      { label: 'Transit Time',   value: '14 days' },
      { label: 'Duty Rate',      value: '6.5% (HS auto-detected)' },
      { label: 'Landed Cost',    value: '$0.48 / unit' },
    ],
    quote: 'Your landed cost is $0.48/unit. I\'ve booked a sample shipment slot.',
  },
  warehouse: {
    lines: [
      { label: 'Location',        value: '📍 Ontario, CA — 2,400 sq ft' },
      { label: 'Initial Stock',   value: '500 units' },
      { label: 'Reorder Trigger', value: '80 units remaining' },
      { label: 'Storage Cost',    value: '$210 / month' },
    ],
    quote: 'Your first pallet lands in 14 days. I\'ll alert you when it clears customs.',
  },
  ecommerce: {
    lines: [
      { label: 'Amazon Listing',  value: 'A+ content generated', status: 'ok' },
      { label: 'Shopify Store',   value: 'Deployed & live',      status: 'ok' },
      { label: 'US Entity',       value: 'LLC formed (Delaware)' },
      { label: 'Payment Rails',   value: 'Stripe connected' },
    ],
    quote: 'Your storefronts are live. Customers can purchase starting today.',
  },
  marketing: {
    lines: [
      { label: 'Day 1–3',  value: 'Meta ads — $500 test budget' },
      { label: 'Day 5',    value: 'Influencer outreach (12 leads)' },
      { label: 'Creative',  value: '3 photos · 1 UGC video script' },
      { label: 'Email Flow', value: '5-step welcome sequence' },
    ],
    quote: 'What do you think of this launch strategy? I can adjust budget or channels.',
  },
};

/* ─── Dashboard KPIs ─── */
const DASHBOARD_KPIS = [
  { label: 'US Revenue',       target: 65920,  prefix: '$', suffix: '',    detail: 'Month 1 · +100%',              color: '#1ab394' },
  { label: 'Compliance',       target: 100,    prefix: '',  suffix: '%',   detail: '✅ FDA Approved',               color: '#22c55e' },
  { label: 'Orders Fulfilled', target: 1000,   prefix: '',  suffix: '',    detail: '—',                             color: '#6366f1' },
  { label: 'Channels Live',    target: 3,      prefix: '',  suffix: ' / 3', detail: 'Amazon · Shopify · DTC',      color: '#f59e0b' },
];

const CHART_BARS = [18, 28, 35, 42, 50, 58, 68, 78, 85, 92, 100];

/* ─── Helpers ─── */
function useCountUp(target: number, duration: number, shouldRun: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!shouldRun) { setValue(0); return; }
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, shouldRun]);
  return value;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
const HeroVisual: React.FC = () => {
  const visualRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>('typing');

  // Orchestrating state
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [allCollapsed, setAllCollapsed] = useState(false);

  // Typing animation
  const [typedText, setTypedText] = useState('');

  const fullPrompt = 'Help me launch my business in the US';

  /* Reset everything back to typing for the next loop */
  const resetAnimation = useCallback(() => {
    setPhase('typing');
    setCompletedAgents([]);
    setExpandedAgent(null);
    setAllCollapsed(false);
    setTypedText('');
  }, []);

  /* Intersection observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (visualRef.current) observer.observe(visualRef.current);
    return () => observer.disconnect();
  }, []);

  /* Typing phase: type letter by letter, then transition to orchestrating */
  useEffect(() => {
    if (!isVisible || phase !== 'typing') return;

    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullPrompt.slice(0, i + 1));
      i++;
      if (i >= fullPrompt.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('orchestrating'), 800);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, phase]);

  /* Orchestrating → Results sequence */
  useEffect(() => {
    if (phase !== 'orchestrating') return;

    // Complete agents one by one with 1.2s gap
    const timers: ReturnType<typeof setTimeout>[] = [];
    const baseDelay = 1500; // first agent completes after pill stagger
    AGENTS.forEach((agent, i) => {
      const t = setTimeout(() => {
        setCompletedAgents(prev => [...prev, agent.id]);
        setExpandedAgent(agent.id);
      }, baseDelay + i * 1200);
      timers.push(t);
    });

    // After all agents complete, transition to results phase briefly, then dashboard
    const totalAgentTime = baseDelay + (AGENTS.length - 1) * 1200 + 800;
    const dashTimer = setTimeout(() => {
      setPhase('results');
      // Wait for the last agent card to be visible, then collapse and show dashboard
      setTimeout(() => {
        setAllCollapsed(true);
        setTimeout(() => setPhase('dashboard'), 600);
      }, 2000);
    }, totalAgentTime);
    timers.push(dashTimer);

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  /* Loop: restart 2 seconds after dashboard finishes animating */
  useEffect(() => {
    if (phase !== 'dashboard') return;
    // Dashboard counters take ~1.2s + chart ~1.5s ≈ let it breathe for 5s total
    const t = setTimeout(() => resetAnimation(), 5000);
    return () => clearTimeout(t);
  }, [phase, resetAnimation]);

  /* Dashboard counter values — cycleKey resets the hooks */
  const isDashboard = phase === 'dashboard';
  const rev   = useCountUp(DASHBOARD_KPIS[0].target, 1200, isDashboard);
  const comp  = useCountUp(DASHBOARD_KPIS[1].target, 1200, isDashboard);
  const ord   = useCountUp(DASHBOARD_KPIS[2].target, 1200, isDashboard);
  const chan  = useCountUp(DASHBOARD_KPIS[3].target, 1200, isDashboard);
  const counters = [rev, comp, ord, chan];

  /* ─── Render ─── */
  return (
    <div
      className={`hero-visual reveal ${isVisible ? 'visible' : ''}`}
      ref={visualRef}
    >
      <div className="dash-mock hero-orchestrator">
        {/* Mac window dots */}
        <div className="dash-bar">
          <div className="dash-dot r" />
          <div className="dash-dot y" />
          <div className="dash-dot g" />
          <div className="orch-title-bar">
            <Sparkles size={13} style={{ color: 'var(--lp-primary)' }} />
            <span>Orbit AI</span>
          </div>
        </div>

        <div className="orch-content">
          {/* ── TYPING PHASE ── */}
          {phase === 'typing' && (
            <div className="typing-phase">
              <div className="chat-bubble">
                <Sparkles size={18} className="chatbot-icon" />
                <span className="typed-text">{typedText}</span>
                <span className="cursor blink" />
              </div>
            </div>
          )}

          {/* ── ORCHESTRATING PHASE ── */}
          {(phase === 'orchestrating' || phase === 'results') && !allCollapsed && (
            <div className="orch-agents-phase">
              <div className="orch-header">
                <div className="orch-header-spinner" />
                <span>Orchestrating AI Agents...</span>
              </div>

              {/* Agent pills in 3-column grid */}
              <div className="orch-agent-grid">
                {AGENTS.map((agent, i) => {
                  const isCompleted = completedAgents.includes(agent.id);

                  return (
                    <div
                      key={agent.id}
                      className={`orch-agent-pill ${isCompleted ? 'completed' : ''}`}
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      <span className="orch-agent-emoji">{agent.emoji}</span>
                      <span className="orch-agent-label">{agent.label}</span>
                      <div className="orch-agent-status">
                        {isCompleted ? (
                          <div className="orch-check-icon">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="spinner small" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active agent result below the grid */}
              {expandedAgent && AGENT_RESULTS[expandedAgent] && (
                <div className="orch-agent-result" key={expandedAgent}>
                  <div className="orch-result-agent-name">
                    {AGENTS.find(a => a.id === expandedAgent)?.emoji}{' '}
                    {AGENTS.find(a => a.id === expandedAgent)?.label}
                  </div>
                  <div className="orch-result-lines">
                    {AGENT_RESULTS[expandedAgent].lines.map((line, li) => (
                      <div
                        key={li}
                        className="orch-result-line"
                        style={{ animationDelay: `${li * 80}ms` }}
                      >
                        <span className="orch-result-label">
                          {line.status === 'ok' && <span className="status-dot ok" />}
                          {line.status === 'warn' && <span className="status-dot warn" />}
                          {line.status === 'trend' && <TrendingUp size={11} className="trend-arrow" />}
                          {line.label}
                        </span>
                        <span className="orch-result-value">{line.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="orch-result-quote">
                    "{AGENT_RESULTS[expandedAgent].quote}"
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── DASHBOARD PHASE ── */}
          {phase === 'dashboard' && (
            <div className="orch-dashboard fade-in">
              <div className="orch-dash-grid">
                {DASHBOARD_KPIS.map((kpi, i) => (
                  <div key={i} className="orch-dash-card" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="orch-dash-label">{kpi.label}</div>
                    <div className="orch-dash-val" style={{ color: kpi.color }}>
                      {kpi.prefix}{counters[i].toLocaleString()}{kpi.suffix}
                    </div>
                    <div className="orch-dash-detail">{kpi.detail}</div>
                  </div>
                ))}
              </div>

              {/* Revenue chart */}
              <div className="orch-chart-section">
                <div className="orch-chart-label">Weekly Revenue</div>
                <div className="orch-chart">
                  {CHART_BARS.map((h, i) => (
                    <div
                      key={i}
                      className="orch-chart-bar"
                      style={{
                        '--bar-h': `${h}%`,
                        animationDelay: `${300 + i * 120}ms`,
                      } as React.CSSProperties}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating badges — dashboard phase */}
      {phase === 'dashboard' && (
        <>
          <div className="hero-float hf-1 fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="hf-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <Check size={16} />
            </div>
            FDA Approved
          </div>
          <div className="hero-float hf-2 fade-in" style={{ animationDelay: '1s' }}>
            <div className="hf-icon" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
              <TrendingUp size={16} />
            </div>
            Revenue +42%
          </div>
        </>
      )}
    </div>
  );
};

export default HeroVisual;
