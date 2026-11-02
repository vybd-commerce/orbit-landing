import { useEffect, useState, type FormEvent } from "react";
import { track } from "../../lib/analytics";
import { RdFooter, RdHeader, RdPage } from "./chrome";
import { useTx, type Tx } from "./i18n";
import "./EcosystemPage.css";

/* /ecosystem: sign-up for the people who help brands enter the US (customs
   brokers, agencies, distributors and so on). Brands' agents find them
   here, and each partner works through a Vybd agent or one of their own.
   English only for now. Applications go out as a pre-filled email, as on
   /rainmaker: no form backend exists yet. The email stays in English for
   the team reading it. */

const APPLY_EMAIL = "hello@vybd.ai";

const CATEGORIES = [
    "Customs brokers",
    "Freight & 3PL",
    "Marketing agencies",
    "Distributors & wholesale",
    "Compliance & regulatory (FDA, FCC, CPSC)",
    "Legal & IP",
    "Accounting & tax",
    "Retail & marketplace ops",
    "Other",
];

const OWN_AGENTS = ["Claude Code", "Claude", "Codex", "OpenAI", "Other"];

const AGENT_CHOICES = [
    ["vybd", "Give me a Vybd agent"],
    ["own", "I'll bring my own"],
    ["unsure", "Not sure yet"],
] as const;

type AgentChoice = (typeof AGENT_CHOICES)[number][0];

const STEPS = [
    ["Get found", "Brands in the Vybd ecosystem send their agents looking for help. They search by service, category and region, and bring the work to you."],
    ["Get an agent", "Your Vybd agent takes the intake, routes each request and keeps every brand's context, so you can serve more brands than your team could alone."],
    ["Bring your own", "Already run your own agents? Plug them in instead and keep working the way you do."],
];

/* "Ask your AI": opens Claude or ChatGPT with a prompt that points at the
   visitor's briefing in public/agents/ (indexed by public/llms.txt). The
   URL is the live site's, since an assistant can't read a preview or
   localhost. Keep the roles in step with those files. */
const SITE = "https://www.vybd.ai";

const AUDIENCES = [
    ["partner", "Service partner", "I help brands enter the US market", "help me decide whether to join the Vybd Ecosystem, then draft my application. Ask me about my business first."],
    ["brand", "Brand", "I want to sell my brand in the US", "help me work out whether and how to take my brand to the US with Vybd. Ask me about my products first."],
    ["investor", "Investor", "I'm looking at Vybd as a company", "give me a clear summary of what Vybd does, what it's building and what proof it shows."],
    ["press", "Press", "I'm writing about Vybd", "brief me on Vybd for a story: the one-line pitch, the angles and who to contact."],
] as const;

type Audience = (typeof AUDIENCES)[number][0];

function promptFor(a: Audience) {
    const [, , who, task] = AUDIENCES.find(([k]) => k === a)!;
    return `${who}. Read ${SITE}/agents/${a}.md and ${task}`;
}

type Fields = {
    company: string;
    name: string;
    email: string;
    website: string;
    category: string;
    regions: string;
    about: string;
    agent: AgentChoice;
    ownAgent: string;
};

const EMPTY: Fields = {
    company: "",
    name: "",
    email: "",
    website: "",
    category: "",
    regions: "",
    about: "",
    agent: "vybd",
    ownAgent: "",
};

function mailtoFor(f: Fields) {
    const agent = AGENT_CHOICES.find(([k]) => k === f.agent)![1];
    const body = [
        `Company: ${f.company}`,
        `Name: ${f.name}`,
        `Email: ${f.email}`,
        `Website: ${f.website || "-"}`,
        `Service: ${f.category}`,
        `Regions served: ${f.regions || "-"}`,
        `Agent: ${agent}${f.agent === "own" && f.ownAgent ? ` (${f.ownAgent})` : ""}`,
        "",
        "What we do and who we serve:",
        f.about,
    ].join("\n");
    const subject = `Ecosystem application: ${f.company} (${f.category})`;
    return `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function Hero({ tx }: { tx: Tx }) {
    return (
        <section className="eco-hero" id="top" aria-labelledby="eco-h1">
            <div className="wrap">
                <span className="eco-eyebrow mono">
                    <i className="eco-dot"></i>
                    {tx("Vybd Ecosystem · For US market-entry partners")}
                </span>
                <h1 id="eco-h1" className="eco-h1">
                    {tx("Grow with the brands")} <em>{tx("coming to America")}</em>
                </h1>
                <p className="eco-lead">
                    {tx(
                        "Customs brokers, agencies, distributors and every partner a brand needs to launch in the US. Join once, get found by brands' agents, and let an agent help you take on more of them.",
                    )}
                </p>
                <div className="eco-cta">
                    <a className="btn btn-dark" href="#join">
                        {tx("Join the ecosystem")}
                    </a>
                    <a className="btn btn-line" href="#how">
                        {tx("How it works")}
                    </a>
                </div>
            </div>
        </section>
    );
}

function Who({ tx }: { tx: Tx }) {
    return (
        <section className="eco-sec" aria-labelledby="eco-h2a" style={{ paddingTop: 0 }}>
            <div className="wrap">
                <div className="eco-kicker mono">
                    <b>01</b> {tx("Who it's for")}
                </div>
                <h2 id="eco-h2a" className="eco-h2">
                    {tx("Everyone a brand needs")} <em>{tx("to land in the US")}</em>
                </h2>
                <ul className="eco-chips">
                    {CATEGORIES.map((c) => (
                        <li key={c}>{tx(c)}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function How({ tx }: { tx: Tx }) {
    return (
        <section id="how" className="eco-sec eco-how" aria-labelledby="eco-h2b">
            <div className="wrap">
                <div className="eco-kicker mono">
                    <b>02</b> {tx("How it works")}
                </div>
                <h2 id="eco-h2b" className="eco-h2">
                    {tx("Work comes to you.")} <em>{tx("Agents keep up.")}</em>
                </h2>
                <div className="eco-cards">
                    {STEPS.map(([title, text], i) => (
                        <article key={title} className="eco-card rv">
                            <span className="eco-num">{String(i + 1).padStart(2, "0")}</span>
                            <h3>{tx(title)}</h3>
                            <p>{tx(text)}</p>
                            {i === 2 && (
                                <ul className="eco-agents">
                                    {OWN_AGENTS.slice(0, -1).map((a) => (
                                        <li key={a}>{a}</li>
                                    ))}
                                </ul>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AskAI({ tx }: { tx: Tx }) {
    const [audience, setAudience] = useState<Audience>("partner");
    const [copied, setCopied] = useState(false);
    const prompt = promptFor(audience);
    const q = encodeURIComponent(prompt);

    async function copy() {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* Clipboard blocked: the prompt is on screen to copy by hand. */
        }
        track("ecosystem_ask_ai", { audience, via: "copy" });
    }

    return (
        <section id="ask" className="eco-sec" aria-labelledby="eco-h2d">
            <div className="wrap">
                <div className="eco-kicker mono">
                    <b>03</b> {tx("Ask your AI")}
                </div>
                <h2 id="eco-h2d" className="eco-h2">
                    {tx("Rather ask")} <em>{tx("your own agent?")}</em>
                </h2>
                <p className="eco-p">
                    {tx(
                        "Open Claude or ChatGPT with everything it needs to know about Vybd, written for who you are. Then ask it anything.",
                    )}
                </p>
                <div className="eco-ask">
                    <div className="eco-radios" role="radiogroup" aria-label={tx("I am a")}>
                        {AUDIENCES.map(([value, label]) => (
                            <label key={value} className="eco-radio">
                                <input
                                    type="radio"
                                    name="audience"
                                    value={value}
                                    checked={audience === value}
                                    onChange={() => setAudience(value)}
                                />
                                {tx(label)}
                            </label>
                        ))}
                    </div>
                    <p className="eco-prompt mono">{prompt}</p>
                    <div className="eco-cta" style={{ marginTop: 20, animation: "none" }}>
                        <a
                            className="btn btn-dark"
                            href={`https://claude.ai/new?q=${q}`}
                            target="_blank"
                            rel="noopener"
                            onClick={() => track("ecosystem_ask_ai", { audience, via: "claude" })}
                        >
                            {tx("Open in Claude")}
                        </a>
                        <a
                            className="btn btn-dark"
                            href={`https://chatgpt.com/?q=${q}`}
                            target="_blank"
                            rel="noopener"
                            onClick={() => track("ecosystem_ask_ai", { audience, via: "chatgpt" })}
                        >
                            {tx("Open in ChatGPT")}
                        </a>
                        <button type="button" className="btn btn-line" onClick={copy}>
                            {tx(copied ? "Copied" : "Copy prompt")}
                        </button>
                    </div>
                    <p className="eco-fine" style={{ marginTop: 16 }} aria-live="polite">
                        {tx("Using Claude Code, Codex or another agent? Point it at")}{" "}
                        <a href="/llms.txt">vybd.ai/llms.txt</a>{" "}
                        {tx("or read the briefing yourself:")}{" "}
                        <a href={`/agents/${audience}.md`}>{`/agents/${audience}.md`}</a>
                    </p>
                </div>
            </div>
        </section>
    );
}

function Join({ tx }: { tx: Tx }) {
    const [fields, setFields] = useState<Fields>(EMPTY);
    const [sent, setSent] = useState(false);

    const set = (k: keyof Fields) => (e: { target: { value: string } }) => setFields((f) => ({ ...f, [k]: e.target.value }));

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        track("ecosystem_apply", { category: fields.category, agent: fields.agent, own_agent: fields.ownAgent || undefined });
        window.location.href = mailtoFor(fields);
        setSent(true);
    }

    return (
        <section id="join" className="eco-sec" aria-labelledby="eco-h2c">
            <div className="wrap eco-join">
                <div>
                    <div className="eco-kicker mono">
                        <b>04</b> {tx("Join")}
                    </div>
                    <h2 id="eco-h2c" className="eco-h2">
                        {tx("Join the")} <em>{tx("ecosystem")}</em>
                    </h2>
                    <p className="eco-p">
                        {tx("Tell us what you do and who you serve. We'll get back to you to set up your profile and your agent.")}
                    </p>
                </div>
                {sent ? (
                    <p className="eco-sent" role="status">
                        {tx("Your email app should open with your application. If it didn't, send it to")}{" "}
                        <a href={mailtoFor(fields)}>{APPLY_EMAIL}</a>.
                    </p>
                ) : (
                    <form className="eco-form" onSubmit={handleSubmit}>
                        <label>
                            <span>{tx("Company")}</span>
                            <input required autoComplete="organization" value={fields.company} onChange={set("company")} />
                        </label>
                        <label>
                            <span>{tx("Your name")}</span>
                            <input required autoComplete="name" value={fields.name} onChange={set("name")} />
                        </label>
                        <label>
                            <span>{tx("Work email")}</span>
                            <input required type="email" autoComplete="email" value={fields.email} onChange={set("email")} />
                        </label>
                        <label>
                            <span>
                                {tx("Website")} <em>{tx("(optional)")}</em>
                            </span>
                            <input type="url" placeholder="https://" value={fields.website} onChange={set("website")} />
                        </label>
                        <label>
                            <span>{tx("Service")}</span>
                            <select required value={fields.category} onChange={set("category")}>
                                <option value="" disabled>
                                    {tx("Choose one")}
                                </option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {tx(c)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span>
                                {tx("Regions served")} <em>{tx("(optional)")}</em>
                            </span>
                            <input placeholder={tx("e.g. California, Northeast, nationwide")} value={fields.regions} onChange={set("regions")} />
                        </label>
                        <label className="full">
                            <span>{tx("What you do and who you serve")}</span>
                            <textarea required rows={4} value={fields.about} onChange={set("about")} />
                        </label>
                        <fieldset className="full">
                            <legend>{tx("Your agent")}</legend>
                            <div className="eco-radios">
                                {AGENT_CHOICES.map(([value, label]) => (
                                    <label key={value} className="eco-radio">
                                        <input
                                            type="radio"
                                            name="agent"
                                            value={value}
                                            checked={fields.agent === value}
                                            onChange={set("agent")}
                                        />
                                        {tx(label)}
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                        {fields.agent === "own" && (
                            <label className="full">
                                <span>
                                    {tx("Which agent?")} <em>{tx("(optional)")}</em>
                                </span>
                                <select value={fields.ownAgent} onChange={set("ownAgent")}>
                                    <option value="">{tx("Choose one")}</option>
                                    {OWN_AGENTS.map((a) => (
                                        <option key={a} value={a}>
                                            {a === "Other" ? tx(a) : a}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                        <button type="submit" className="btn btn-dark full">
                            {tx("Send application")}
                        </button>
                        <p className="eco-fine full">
                            {tx("This opens your email app with your answers filled in. Questions?")}{" "}
                            <a href={`mailto:${APPLY_EMAIL}`}>{APPLY_EMAIL}</a>
                        </p>
                    </form>
                )}
            </div>
        </section>
    );
}

export default function EcosystemPage() {
    const tx = useTx();

    useEffect(() => {
        const prevTitle = document.title;
        document.title = "Join the Vybd Ecosystem | US market-entry partners";
        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute(
            "content",
            "Customs brokers, agencies, distributors and other US market-entry partners: join the Vybd ecosystem, get found by brands' agents, and grow with your own agent.",
        );
        return () => {
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
        };
    }, []);

    return (
        <RdPage name="eco">
            <RdHeader
                logoHref="/"
                links={[
                    { label: "What we do", href: "/us#services" },
                    { label: "Case studies", href: "/case-studies" },
                    { label: "Ecosystem", href: "#top", current: true },
                ]}
                mobileLinks={[
                    { label: "Home", href: "/" },
                    { label: "Case studies", href: "/case-studies" },
                    { label: "How it works", href: "#how" },
                ]}
                ctaHref="#join"
                ctaLabel="Join"
            />
            <Hero tx={tx} />
            <Who tx={tx} />
            <How tx={tx} />
            <AskAI tx={tx} />
            <Join tx={tx} />
            <RdFooter />
        </RdPage>
    );
}
