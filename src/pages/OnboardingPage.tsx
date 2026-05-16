import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight, ArrowLeft, Check,
  Zap, Package, ChartColumn, ShoppingCart, Globe, Truck, MessageSquare,
} from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./OnboardingPage.css";

// ── Shared types ───────────────────────────────────────────────────────────

interface Option {
  value: string;
  label: string;
  sublabel?: string;
}

interface FormData {
  companyName: string;
  brandName: string;
  website: string;
  province: string;
  industry: string;
  categories: string[];
  monthlyVolume: string;
  hasHsCodes: string;
  sellingInUS: string;
  targetChannels: string[];
  launchTimeline: string;
  challenges: string[];
  contactName: string;
  email: string;
  wechatId: string;
  preferredContact: string;
}

const INITIAL: FormData = {
  companyName: "", brandName: "", website: "", province: "", industry: "",
  categories: [], monthlyVolume: "", hasHsCodes: "", sellingInUS: "",
  targetChannels: [], launchTimeline: "", challenges: [],
  contactName: "", email: "", wechatId: "", preferredContact: "wechat",
};

// ── Icon maps (stable across languages — keyed by option value) ────────────

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  electronics: <Zap size={14} />,
  apparel:     <Package size={14} />,
  beauty:      <ChartColumn size={14} />,
  food:        <ShoppingCart size={14} />,
  home:        <Package size={14} />,
  sports:      <Globe size={14} />,
  baby:        <Package size={14} />,
  pets:        <Package size={14} />,
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  amazon:  <ShoppingCart size={14} />,
  shopify: <Globe size={14} />,
  tiktok:  <Zap size={14} />,
  walmart: <Package size={14} />,
  temu:    <Truck size={14} />,
  other:   <ChartColumn size={14} />,
};

// ── Helpers ────────────────────────────────────────────────────────────────

function toggleVal(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function CheckboxChip({
  option, checked, onClick, icon,
}: { option: Option; checked: boolean; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      className={`ob-chip ${checked ? "ob-chip--active" : ""}`}
      onClick={onClick}
    >
      {icon && <span className="ob-chip-icon">{icon}</span>}
      {option.label}
      {checked && <Check size={13} strokeWidth={3} className="ob-chip-check" />}
    </button>
  );
}

function RadioCard({
  option, selected, onSelect,
}: { option: Option; selected: string; onSelect: (v: string) => void }) {
  return (
    <button
      type="button"
      className={`ob-radio-card ${selected === option.value ? "ob-radio-card--active" : ""}`}
      onClick={() => onSelect(option.value)}
    >
      <span className="ob-radio-dot" />
      <span>
        <span className="ob-radio-label">{option.label}</span>
        {option.sublabel && <span className="ob-radio-sub">{option.sublabel}</span>}
      </span>
    </button>
  );
}

// ── Step 1 ─────────────────────────────────────────────────────────────────

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  const { t } = useTranslation();
  const f = (k: string) => t(`onboarding.step1.${k}`, { returnObjects: true }) as { label: string; placeholder?: string };
  const provinces = t("onboarding.step1.provinces", { returnObjects: true }) as Option[];
  const industries = t("onboarding.step1.industries", { returnObjects: true }) as Option[];

  return (
    <div className="ob-step-body">
      <div className="ob-field-row">
        <div className="ob-field">
          <label className="ob-label">
            {f("companyName").label} <span className="ob-required">{t("onboarding.required")}</span>
          </label>
          <input className="ob-input" placeholder={f("companyName").placeholder} value={data.companyName} onChange={(e) => set("companyName", e.target.value)} />
        </div>
        <div className="ob-field">
          <label className="ob-label">
            {f("brandName").label} <span className="ob-required">{t("onboarding.required")}</span>
          </label>
          <input className="ob-input" placeholder={f("brandName").placeholder} value={data.brandName} onChange={(e) => set("brandName", e.target.value)} />
        </div>
      </div>

      <div className="ob-field-row">
        <div className="ob-field">
          <label className="ob-label">{f("website").label}</label>
          <input className="ob-input" placeholder={f("website").placeholder} value={data.website} onChange={(e) => set("website", e.target.value)} />
        </div>
        <div className="ob-field">
          <label className="ob-label">
            {f("province").label} <span className="ob-required">{t("onboarding.required")}</span>
          </label>
          <select className="ob-input ob-select" value={data.province} onChange={(e) => set("province", e.target.value)}>
            <option value="">{f("province").placeholder}</option>
            {provinces.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">
          {f("industry").label} <span className="ob-required">{t("onboarding.required")}</span>
        </label>
        <div className="ob-chip-grid">
          {industries.map((ind) => (
            <CheckboxChip
              key={ind.value}
              option={ind}
              checked={data.industry === ind.value}
              onClick={() => set("industry", data.industry === ind.value ? "" : ind.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 2 ─────────────────────────────────────────────────────────────────

function Step2({
  data, set, toggleArr,
}: { data: FormData; set: (k: keyof FormData, v: string) => void; toggleArr: (k: keyof FormData, v: string) => void }) {
  const { t } = useTranslation();
  const categories  = t("onboarding.step2.categoryOptions", { returnObjects: true }) as Option[];
  const volumes     = t("onboarding.step2.volumeOptions",   { returnObjects: true }) as Option[];
  const hasHsOpts   = t("onboarding.step2.hasHsOptions",    { returnObjects: true }) as Option[];
  const sellingOpts = t("onboarding.step2.sellingOptions",  { returnObjects: true }) as Option[];
  const f = (k: string) => t(`onboarding.step2.${k}`, { returnObjects: true }) as { label: string };

  return (
    <div className="ob-step-body">
      <div className="ob-field">
        <label className="ob-label">
          {f("categories").label} <span className="ob-required">{t("onboarding.required")}</span>{" "}
          <span className="ob-label-hint">{t("onboarding.multiSelectHint")}</span>
        </label>
        <div className="ob-chip-grid">
          {categories.map((c) => (
            <CheckboxChip
              key={c.value}
              option={c}
              icon={CATEGORY_ICONS[c.value]}
              checked={data.categories.includes(c.value)}
              onClick={() => toggleArr("categories", c.value)}
            />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">
          {f("monthlyVolume").label} <span className="ob-required">{t("onboarding.required")}</span>
        </label>
        <div className="ob-radio-grid">
          {volumes.map((v) => (
            <RadioCard key={v.value} option={v} selected={data.monthlyVolume} onSelect={(val) => set("monthlyVolume", val)} />
          ))}
        </div>
      </div>

      <div className="ob-field-row">
        <div className="ob-field">
          <label className="ob-label">{f("hasHsCodes").label}</label>
          <div className="ob-radio-inline">
            {hasHsOpts.map((o) => (
              <RadioCard key={o.value} option={o} selected={data.hasHsCodes} onSelect={(v) => set("hasHsCodes", v)} />
            ))}
          </div>
        </div>
        <div className="ob-field">
          <label className="ob-label">{f("sellingInUS").label}</label>
          <div className="ob-radio-inline">
            {sellingOpts.map((o) => (
              <RadioCard key={o.value} option={o} selected={data.sellingInUS} onSelect={(v) => set("sellingInUS", v)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3 ─────────────────────────────────────────────────────────────────

function Step3({
  data, set, toggleArr,
}: { data: FormData; set: (k: keyof FormData, v: string) => void; toggleArr: (k: keyof FormData, v: string) => void }) {
  const { t } = useTranslation();
  const channels   = t("onboarding.step3.channelOptions",   { returnObjects: true }) as Option[];
  const timelines  = t("onboarding.step3.timelineOptions",  { returnObjects: true }) as Option[];
  const challenges = t("onboarding.step3.challengeOptions", { returnObjects: true }) as Option[];
  const f = (k: string) => t(`onboarding.step3.${k}`, { returnObjects: true }) as { label: string };

  return (
    <div className="ob-step-body">
      <div className="ob-field">
        <label className="ob-label">
          {f("channels").label} <span className="ob-required">{t("onboarding.required")}</span>{" "}
          <span className="ob-label-hint">{t("onboarding.multiSelectHint")}</span>
        </label>
        <div className="ob-chip-grid">
          {channels.map((c) => (
            <CheckboxChip
              key={c.value}
              option={c}
              icon={CHANNEL_ICONS[c.value]}
              checked={data.targetChannels.includes(c.value)}
              onClick={() => toggleArr("targetChannels", c.value)}
            />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">
          {f("timeline").label} <span className="ob-required">{t("onboarding.required")}</span>
        </label>
        <div className="ob-radio-grid">
          {timelines.map((tl) => (
            <RadioCard key={tl.value} option={tl} selected={data.launchTimeline} onSelect={(val) => set("launchTimeline", val)} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">
          {f("challenges").label}{" "}
          <span className="ob-label-hint">{t("onboarding.multiSelectHint")}</span>
        </label>
        <div className="ob-chip-grid">
          {challenges.map((c) => (
            <CheckboxChip
              key={c.value}
              option={c}
              checked={data.challenges.includes(c.value)}
              onClick={() => toggleArr("challenges", c.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 4 ─────────────────────────────────────────────────────────────────

function Step4({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  const { t } = useTranslation();
  const contactOpts = t("onboarding.step4.contactOptions", { returnObjects: true }) as Option[];
  const f = (k: string) => t(`onboarding.step4.${k}`, { returnObjects: true }) as { label: string; placeholder?: string };

  return (
    <div className="ob-step-body">
      <div className="ob-field-row">
        <div className="ob-field">
          <label className="ob-label">
            {f("contactName").label} <span className="ob-required">{t("onboarding.required")}</span>
          </label>
          <input className="ob-input" placeholder={f("contactName").placeholder} value={data.contactName} onChange={(e) => set("contactName", e.target.value)} />
        </div>
        <div className="ob-field">
          <label className="ob-label">
            {f("email").label} <span className="ob-required">{t("onboarding.required")}</span>
          </label>
          <input className="ob-input" type="email" placeholder={f("email").placeholder} value={data.email} onChange={(e) => set("email", e.target.value)} />
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">
          <span className="ob-wechat-icon"><MessageSquare size={15} strokeWidth={2} /></span>
          {f("wechatId").label}
        </label>
        <input className="ob-input" placeholder={f("wechatId").placeholder} value={data.wechatId} onChange={(e) => set("wechatId", e.target.value)} />
      </div>

      <div className="ob-field">
        <label className="ob-label">{f("preferredContact").label}</label>
        <div className="ob-radio-grid ob-radio-grid--3col">
          {contactOpts.map((o) => (
            <RadioCard key={o.value} option={o} selected={data.preferredContact} onSelect={(v) => set("preferredContact", v)} />
          ))}
        </div>
      </div>

      <div className="ob-privacy-note">
        <Check size={13} strokeWidth={3} style={{ color: "var(--lp-primary)", flexShrink: 0 }} />
        {t("onboarding.step4.privacyNote")}
      </div>
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────────────────────

function StepSuccess({ data }: { data: FormData }) {
  const { t } = useTranslation();
  const channelOpts  = t("onboarding.step3.channelOptions",  { returnObjects: true }) as Option[];
  const timelineOpts = t("onboarding.step3.timelineOptions", { returnObjects: true }) as Option[];
  const contactOpts  = t("onboarding.step4.contactOptions",  { returnObjects: true }) as Option[];

  const getLabel = (opts: Option[], val: string) => opts.find((o) => o.value === val)?.label || val;

  const channelLabels  = data.targetChannels.map((v) => getLabel(channelOpts, v)).join("、");
  const timelineLabel  = getLabel(timelineOpts, data.launchTimeline);
  const contactLabel   = getLabel(contactOpts, data.preferredContact);
  const contactDisplay = data.preferredContact === "wechat" && data.wechatId
    ? `${t("onboarding.success.wechatPrefix")} ${data.wechatId}`
    : `${contactLabel}: ${data.email}`;

  return (
    <div className="ob-success">
      <div className="ob-success-icon">
        <Check size={32} strokeWidth={3} />
      </div>
      <h2 className="ob-success-title">{t("onboarding.success.title")}</h2>
      <p className="ob-success-subtitle">
        {t("onboarding.success.subtitle", { name: data.contactName || data.brandName })}
      </p>

      <div className="ob-success-summary">
        <div className="ob-success-row">
          <span className="ob-success-key">{t("onboarding.success.labels.brandName")}</span>
          <span className="ob-success-val">{data.brandName}</span>
        </div>
        {channelLabels && (
          <div className="ob-success-row">
            <span className="ob-success-key">{t("onboarding.success.labels.targetChannels")}</span>
            <span className="ob-success-val">{channelLabels}</span>
          </div>
        )}
        {data.launchTimeline && (
          <div className="ob-success-row">
            <span className="ob-success-key">{t("onboarding.success.labels.launchTimeline")}</span>
            <span className="ob-success-val">{timelineLabel}</span>
          </div>
        )}
        <div className="ob-success-row">
          <span className="ob-success-key">{t("onboarding.success.labels.contactMethod")}</span>
          <span className="ob-success-val">{contactDisplay}</span>
        </div>
      </div>

      <a href="/" className="ob-back-home">{t("onboarding.success.backHome")}</a>
    </div>
  );
}

// ── Validation ─────────────────────────────────────────────────────────────

function canProceed(step: number, data: FormData): boolean {
  switch (step) {
    case 0: return !!(data.companyName && data.brandName && data.province && data.industry);
    case 1: return !!(data.categories.length > 0 && data.monthlyVolume);
    case 2: return !!(data.targetChannels.length > 0 && data.launchTimeline);
    case 3: return !!(data.contactName && data.email);
    default: return true;
  }
}

// ── Main component ─────────────────────────────────────────────────────────

function buildTask(data: FormData): string {
  const parts: string[] = [];
  if (data.brandName) parts.push(`Brand: ${data.brandName}`);
  if (data.industry)  parts.push(`Industry: ${data.industry}`);
  if (data.categories.length) parts.push(`Products: ${data.categories.join(", ")}`);
  if (data.monthlyVolume) parts.push(`Monthly volume: ${data.monthlyVolume} units`);
  if (data.sellingInUS) parts.push(`Currently selling in US: ${data.sellingInUS}`);
  if (data.hasHsCodes) parts.push(`Has HS codes: ${data.hasHsCodes}`);
  if (data.targetChannels.length) parts.push(`Target channels: ${data.targetChannels.join(", ")}`);
  if (data.launchTimeline) parts.push(`Launch timeline: ${data.launchTimeline}`);
  if (data.challenges.length) parts.push(`Key challenges: ${data.challenges.join(", ")}`);

  const summary = parts.join(". ");
  return `Help ${data.brandName || "this brand"} enter the US market. ${summary}. Provide a concrete action plan covering compliance, logistics, and go-to-market strategy.`;
}

export default function OnboardingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [data, setData] = useState<FormData>(INITIAL);

  const steps = t("onboarding.steps", { returnObjects: true }) as Array<{ label: string; sublabel: string }>;

  const setField = (k: keyof FormData, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }));

  const toggleArrField = (k: keyof FormData, v: string) =>
    setData((prev) => ({ ...prev, [k]: toggleVal(prev[k] as string[], v) }));

  const next = async () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const task = buildTask(data);

    // In local dev the API route doesn't exist — skip the Airtable call.
    if (import.meta.env.DEV) {
      await new Promise((r) => setTimeout(r, 600));
      setSubmitting(false);
      navigate("/control", { state: { task } });
      return;
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language: i18n.language.startsWith("zh") ? "zh" : "en" }),
      });
      if (!res.ok) throw new Error("failed");
      navigate("/control", { state: { task } });
    } catch {
      setSubmitError(t("onboarding.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="ob-page">
      {/* Header */}
      <header className="ob-header">
        <a href="/" className="ob-logo">Orbit</a>
        <div className="ob-header-right">
          <LanguageSwitcher />
          <a href="/" className="ob-header-back">{t("onboarding.header.backHome")}</a>
        </div>
      </header>

      <main className="ob-main">
        <div className="ob-card">
            {/* Progress bar */}
            <div className="ob-progress-wrap">
              <div className="ob-progress-bar" style={{ width: `${progress}%` }} />
            </div>

            {/* Step indicators */}
            <div className="ob-steps-nav">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`ob-step-dot-wrap ${i <= step ? "ob-step-dot-wrap--done" : ""} ${i === step ? "ob-step-dot-wrap--active" : ""}`}
                >
                  <div className="ob-step-dot">
                    {i < step ? <Check size={12} strokeWidth={3} /> : <span>{i + 1}</span>}
                  </div>
                  <div className="ob-step-dot-label">
                    <span className="ob-step-dot-main">{s.label}</span>
                    <span className="ob-step-dot-sub">{s.sublabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="ob-card-body">
              <div className="ob-step-header">
                <div className="ob-step-counter">
                  {t("onboarding.nav.stepCounter", { current: step + 1, total: steps.length })}
                </div>
                <h1 className="ob-step-title">{steps[step].label}</h1>
                <p className="ob-step-desc">{steps[step].sublabel}</p>
              </div>

              {step === 0 && <Step1 data={data} set={setField} />}
              {step === 1 && <Step2 data={data} set={setField} toggleArr={toggleArrField} />}
              {step === 2 && <Step3 data={data} set={setField} toggleArr={toggleArrField} />}
              {step === 3 && <Step4 data={data} set={setField} />}
            </div>

            {/* Navigation */}
            <div className="ob-card-footer">
              {step > 0 ? (
                <button className="ob-btn ob-btn--ghost" onClick={back} disabled={submitting}>
                  <ArrowLeft size={16} /> {t("onboarding.nav.back")}
                </button>
              ) : (
                <span />
              )}
              <div className="ob-footer-right">
                {submitError && <span className="ob-submit-error">{submitError}</span>}
                <button
                  className="ob-btn ob-btn--primary"
                  onClick={next}
                  disabled={!canProceed(step, data) || submitting}
                >
                  {submitting ? (
                    <><span className="ob-spinner" /> {t("onboarding.nav.submitting")}</>
                  ) : step < steps.length - 1 ? (
                    <>{t("onboarding.nav.next")} <ArrowRight size={16} /></>
                  ) : (
                    <>{t("onboarding.nav.submit")} <Check size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}
