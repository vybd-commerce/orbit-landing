import { useEffect, useState } from "react";
import { Menu, X, Check, Plus, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import "./LandingPage.css";
import "./RobotsPage.css";

const BOOK_URL = "https://www.vybd.ai/book";
const US_URL = "https://www.vybd.ai/us";
const FCC_LIST_URL = "https://www.fcc.gov/supplychain/coveredlist";

const STATUS = [
    { tag: "In force", tone: "red", title: "FCC Covered List", body: "New foreign robot models blocked since Jul 28, 2026" },
    { tag: "Pending", tone: "amber", title: "Section 232", body: "Declared a security risk Oct 28, 2026. No tariffs yet" },
    { tag: "Open", tone: "green", title: "Conditional Approval", body: "15 robot product lines cleared by the Department of War" },
];

const RULES = [
    {
        tag: "FCC · In force",
        tone: "red",
        title: "Covered List: foreign-produced advanced robotic devices",
        date: "Effective July 28, 2026",
        points: [
            "New models can't receive FCC equipment authorization. Without it, a radio-equipped robot can't legally be imported, marketed or sold in the US.",
            "It looks forward, not back. Models authorized before July 28, 2026 can still be imported and sold, and units customers already own aren't affected.",
            "The only exception for new models is a Conditional Approval from the Department of War (DoW).",
        ],
    },
    {
        tag: "Commerce · Pending",
        tone: "amber",
        title: "Section 232: robotics and industrial machinery",
        date: "Proclaimed October 28, 2026",
        points: [
            "The President agreed with Commerce that imported robotics, industrial machinery and their components threaten national security.",
            "No new tariffs, quotas or fees were imposed. Commerce and USTR were told to negotiate agreements with trading partners instead.",
            "A progress report is due by April 26, 2027. If talks don't work, tariffs or other trade remedies can follow.",
        ],
    },
];

const CRITERIA = [
    { title: "It moves on the ground", body: "It can move itself across the ground on legs, wheels or tracks.", out: "Stationary? It can enter." },
    { title: "It weighs over 4.4 lb (2 kg)", body: "Weight is measured with its dock or base station included.", out: "4.4 lb or less with its dock? It can enter." },
    { title: "It senses its surroundings", body: "Cameras, lidar, depth, proximity or similar environmental sensors.", out: "No environmental sensors? It can enter." },
    { title: "It connects at 200 kbps or faster", body: "Any network connection at or above 200 kilobits per second.", out: "Offline, or slower than 200 kbps? It can enter." },
    { title: "It runs navigation or control software", body: "Local or remote software that steers or controls the device.", out: "No such software? It can enter." },
    {
        title: "It's made abroad",
        body: "It isn't a US 'domestic end product': made in the US with more than 65% of component cost domestic. US final assembly of foreign parts doesn't count.",
        out: "A US domestic end product? It can enter.",
    },
];

const CARVE_OUTS = [
    "Fixed industrial arms: articulated, SCARA, Cartesian and parallel (delta) robots",
    "FDA-regulated medical devices",
    "Connected vehicles and rail-only vehicles",
    "Uncrewed underwater vehicles",
];

const FAQ = [
    {
        q: "Can we still sell models made before the rule took effect?",
        a: "It depends on authorization, not on when units were built. If the model received FCC equipment authorization before July 28, 2026, you and your retailers can keep importing, marketing and selling it, including newly built units of that same model. A model that wasn't authorized by then is blocked, even if the units already exist.",
    },
    {
        q: "Can the FCC take that away later?",
        a: "Yes. Under 47 CFR § 2.939(e), the FCC can limit existing authorizations and block further imports or sales of models it already approved. It must first issue a public notice, allow at least 30 days of comment and run a public interest analysis. It did this for Covered List equipment from 2024 and earlier in June 2026, and proposed it for certain drones in August. Robots haven't been targeted yet, but grandfathered status isn't guaranteed.",
    },
    {
        q: "Our robot is stationary. Is it blocked?",
        a: "No, it can enter. Fixed industrial arms (articulated, SCARA, Cartesian and parallel robots) are carved out by name, and a robot that can't move itself across the ground isn't blocked. Mounting a fixed arm on a mobile base changes the answer.",
    },
    {
        q: "What about small or light robots?",
        a: "Robots at 4.4 lb (2 kg) or less, dock or base station included, can enter. Because the dock counts, a light robot with a heavy charging station can still be blocked.",
    },
    {
        q: "Can we push software updates to robots already in the US?",
        a: "Yes, for devices authorized before July 28, 2026. An FCC waiver allows Class I and Class II permissive changes for software and firmware through at least January 1, 2029, when the update protects US users. That includes security patches, keeping existing features working, and operating system compatibility.",
    },
    {
        q: "Does final assembly in the US make it 'domestic'?",
        a: "No. A robot counts as foreign-produced unless it's a 'domestic end product' under the Buy American standard: made in the US with more than 65% of component cost domestic. False origin claims get enforced. In August 2026 the FCC revoked a drone maker's authorizations after finding its claims of US design and assembly were false.",
    },
    {
        q: "Are customers who already own our robots affected?",
        a: "No. The rule doesn't affect units already bought or in use. It controls new authorizations, which determines what can be imported and sold from now on.",
    },
    {
        q: "Are there tariffs on robots now?",
        a: "No new ones. The October 28, 2026 Section 232 proclamation found a national security threat but imposed no tariffs, quotas or fees. Commerce and USTR are negotiating with trading partners and must report on progress by April 26, 2027. Existing duties, including Section 301 tariffs on China-origin goods, still apply.",
    },
];

const APPLICATION = [
    { term: "Ownership and control", desc: "Corporate structure, beneficial owners and any foreign government influence." },
    { term: "Supply chain", desc: "Where the device is manufactured, who supplies critical parts, and where software and data are handled." },
    { term: "Onshoring plan", desc: "A time-bound plan for US capital spending, hiring and facilities." },
];

const APPROVALS = [
    ["ABB Robotics", "AMMR G0540, AMMR G1240, P204V", "Nov 6, 2026"],
    ["Pantograph Industries", "Pandroid robot hardware", "Nov 6, 2026"],
    ["ARAPL RaaS", "Maia2000 pallet truck, Atlas AC2000 forklift", "Oct 30, 2026"],
    ["ATI Motors", "Sherpa 3K / 10K / Mecha, FlexFork", "Oct 30, 2026"],
    ["Lightberry", "Lumi interactive mobile robots", "Oct 30, 2026"],
    ["SunScout", "Eco, Pro, Promax platforms", "Oct 30, 2026"],
    ["Swap Robotics", "V7 robot", "Oct 30, 2026"],
    ["OMRON", "LD-150, LD-300 platforms", "Oct 30, 2026"],
    ["Haystack Robotics", "Violet AI robotic device", "Oct 23, 2026"],
    ["T-Robotics", "Entire AGV product class", "Oct 23, 2026"],
    ["Vulcan Robotics", "Sourccey mobile platform", "Oct 21, 2026"],
    ["Volley Automation", "AGVs and AMRs", "Oct 16, 2026"],
    ["Matic Robots", "Floor cleaner 4MA0001 + dock", "Oct 2, 2026"],
    ["ANSCER Robotics", "AR250, AR650, AR1250", "Sep 18, 2026"],
    ["Husqvarna", "305v, 310v, 420v, 440v IQ", "Sep 9, 2026"],
];

const TIMELINE = [
    { date: "Dec 22, 2025", title: "Drones set the template", body: "Foreign-produced drones and critical components are added to the Covered List, with Conditional Approval as the exception." },
    { date: "Mar 23, 2026", title: "Routers follow", body: "Routers produced abroad are added under the same model." },
    { date: "Jul 28, 2026", title: "Robots added", body: "Foreign-produced advanced robotic devices join the Covered List. A waiver issued the same day allows software updates to previously authorized devices." },
    { date: "Aug 11, 2026", title: "Origin claims enforced", body: "The FCC revokes a drone maker's authorizations over false claims of US design and assembly." },
    { date: "Sep 9, 2026", title: "First robots approved", body: "Husqvarna becomes the first robot maker to receive a Conditional Approval." },
    { date: "Oct 28, 2026", title: "Section 232 proclamation", body: "Robotics and industrial machinery imports are declared a security threat. Negotiations first, with tariffs possible later." },
    { date: "Apr 26, 2027", upcoming: true, title: "Section 232 progress report", body: "Commerce and USTR report on talks with trading partners. This is when tariffs could come back on the table." },
    { date: "Jan 1, 2029", upcoming: true, title: "Software waiver horizon", body: "The software-update waiver for previously authorized robots runs through at least this date." },
];

const ROUTES = [
    {
        when: "If you already have FCC IDs",
        title: "Keep selling authorized models",
        body: "Continue importing and selling models authorized before July 28, 2026, with inventory, retail and update plans that still work if the FCC tightens the rules.",
    },
    {
        when: "If your US customers don't need every capability",
        title: "Re-scope the product",
        body: "Build stationary, sub-2 kg or offline configurations that fall outside the definition, documented so regulators can verify them.",
    },
    {
        when: "If you have a new model to launch",
        title: "File for Conditional Approval",
        body: "We prepare the ownership, supply chain and onshoring filing for the DoW, then track your milestones after approval.",
    },
    {
        when: "If you plan to manufacture in the US",
        title: "Build it in the US",
        body: "Our partner network helps you reach domestic end product status: US manufacturing with more than 65% domestic component cost.",
    },
];

const SOURCES = [
    { label: "FCC Covered List and Conditional Approvals", href: FCC_LIST_URL },
    { label: "47 CFR § 2.939: revoking or limiting authorizations", href: "https://www.ecfr.gov/current/title-47/section-2.939" },
    { label: "48 CFR § 25.101: domestic end product test", href: "https://www.ecfr.gov/current/title-48/section-25.101" },
];

/* ── Screener ─────────────────────────────────────────────── */

type QuestionId = "category" | "weight" | "capability" | "domestic" | "authorization";
type ResultId =
    | "excludedCategory"
    | "uas"
    | "underWeight"
    | "missingCapability"
    | "domesticProduct"
    | "grandfathered"
    | "approved"
    | "blocked";

type Option = { label: string; next: QuestionId | ResultId };

const QUESTIONS: Record<QuestionId, { q: string; help: string; options: Option[] }> = {
    category: {
        q: "What kind of machine is it?",
        help: "Pick the closest match for the product you want to bring in.",
        options: [
            { label: "Mobile ground robot: humanoid, quadruped, AMR/AGV, mower, vacuum, delivery or companion robot", next: "weight" },
            { label: "Stationary industrial arm: articulated, SCARA, Cartesian or delta", next: "excludedCategory" },
            { label: "FDA-regulated medical device", next: "excludedCategory" },
            { label: "Drone or other uncrewed aircraft", next: "uas" },
            { label: "Connected vehicle, rail-only vehicle or underwater vehicle", next: "excludedCategory" },
        ],
    },
    weight: {
        q: "Does it weigh more than 4.4 lb (2 kg), including its dock?",
        help: "Weigh the robot together with any charging dock or base station it ships with.",
        options: [
            { label: "Yes, over 4.4 lb", next: "capability" },
            { label: "No, 4.4 lb or less", next: "underWeight" },
        ],
    },
    capability: {
        q: "Does it have all three: environmental sensors, a 200 kbps+ network connection, and navigation or control software?",
        help: "For example cameras or lidar, Wi-Fi or cellular, and on-board or cloud autonomy.",
        options: [
            { label: "Yes, all three", next: "domestic" },
            { label: "No, at least one is missing", next: "missingCapability" },
        ],
    },
    domestic: {
        q: "Is it a US 'domestic end product'?",
        help: "Manufactured in the US, with domestic components making up more than 65% of total component cost.",
        options: [
            { label: "Yes", next: "domesticProduct" },
            { label: "No, or not yet", next: "authorization" },
        ],
    },
    authorization: {
        q: "What is this model's FCC status?",
        help: "Look up the FCC ID on the product label.",
        options: [
            { label: "Authorized before July 28, 2026", next: "grandfathered" },
            { label: "Has a DoW Conditional Approval", next: "approved" },
            { label: "Not yet authorized, or a new model", next: "blocked" },
        ],
    },
};

const RESULTS: Record<ResultId, { badge: string; tone: "green" | "amber" | "red"; title: string; body: string; steps: string[] }> = {
    excludedCategory: {
        badge: "Can enter",
        tone: "green",
        title: "The robot rule doesn't apply to this category.",
        body: "Fixed industrial arms, FDA-regulated medical devices and vehicles are carved out, so they can enter the US. The usual FCC authorization, customs and safety rules still apply.",
        steps: [
            "Confirm the product ships as a fixed installation. Putting it on a mobile base could get it blocked.",
            "Watch your Section 232 exposure, since it covers industrial machinery too.",
        ],
    },
    uas: {
        badge: "Separate drone rule",
        tone: "amber",
        title: "Drones are blocked under their own rule.",
        body: "The robot rule doesn't apply to drones, but a separate FCC rule has blocked new foreign-produced drones and critical components since December 22, 2025. It has its own ways in, including Conditional Approval and Blue UAS listings.",
        steps: ["Check the drone exceptions on the FCC Covered List.", "Drones have their own Conditional Approval process."],
    },
    underWeight: {
        badge: "Can enter",
        tone: "green",
        title: "Too light to be blocked.",
        body: "At 4.4 lb (2 kg) or less with its dock, the robot rule doesn't apply. It can enter the US through normal FCC authorization.",
        steps: ["Record the weight with the dock included in your test reports.", "Heavier models in the same product line may still be blocked."],
    },
    missingCapability: {
        badge: "Likely can enter",
        tone: "green",
        title: "Probably not blocked.",
        body: "A robot is blocked only if it has all three: sensors, a 200 kbps+ connection and navigation software. If one is genuinely missing, the rule doesn't apply. Regulators will check this closely.",
        steps: [
            "Document exactly what the device can and cannot do before you file.",
            "A firmware update that adds connectivity or autonomy could get it blocked.",
        ],
    },
    domesticProduct: {
        badge: "Can enter",
        tone: "green",
        title: "Made in the US, so it isn't blocked.",
        body: "If the robot is made in the US and more than 65% of its component cost is domestic, the rule doesn't count it as foreign-produced.",
        steps: ["Keep a component cost breakdown that will hold up in an audit.", "US final assembly of mostly foreign parts doesn't qualify."],
    },
    grandfathered: {
        badge: "Can keep selling",
        tone: "green",
        title: "You can keep importing and selling this model.",
        body: "Models authorized before July 28, 2026 can still be imported, marketed and sold. An FCC waiver allows software and firmware updates that protect users through at least January 1, 2029.",
        steps: [
            "Don't change the hardware. A materially new model needs a new authorization, and would be blocked.",
            "Watch 47 CFR § 2.939(e). After public notice and comment, the FCC can block imports of models it already authorized. It has already done this for other product categories.",
        ],
    },
    approved: {
        badge: "Can enter",
        tone: "green",
        title: "Your Conditional Approval lets you in.",
        body: "Devices with a DoW Conditional Approval are not blocked and can get FCC authorization, as long as the company keeps to its onshoring plan and passes continued vetting.",
        steps: ["Track your onshoring milestones. Missing them can end the approval.", "Make sure every SKU you ship is named in the approval."],
    },
    blocked: {
        badge: "Blocked for now",
        tone: "red",
        title: "This model can't enter without a Conditional Approval.",
        body: "A new foreign-produced robot with all six traits can't get FCC authorization today. To get in, you need a DoW Conditional Approval backed by a time-bound US onshoring plan, or a version of the product the rule doesn't apply to.",
        steps: [
            "Check whether a stationary, lighter or offline configuration fits your US customers.",
            "Build the onshoring plan: US capital spending, hiring and facilities.",
            "Vybd can prepare the filing and line up US manufacturing partners.",
        ],
    },
};

const TOTAL_QUESTIONS = 5;
const isQuestion = (id: string): id is QuestionId => id in QUESTIONS;

function Screener() {
    // History of visited question ids; the result (if any) is held separately.
    const [path, setPath] = useState<QuestionId[]>(["category"]);
    const [result, setResult] = useState<ResultId | null>(null);

    const current = path[path.length - 1];
    const question = QUESTIONS[current];

    const choose = (next: QuestionId | ResultId) => {
        if (isQuestion(next)) setPath([...path, next]);
        else setResult(next);
    };

    const back = () => {
        if (result) setResult(null);
        else if (path.length > 1) setPath(path.slice(0, -1));
    };

    const restart = () => {
        setPath(["category"]);
        setResult(null);
    };

    if (result) {
        const r = RESULTS[result];
        return (
            <div className="rb-screener-card" aria-live="polite">
                <p className="rb-screener-step">Your first read</p>
                <span className={`rb-tag rb-tag--${r.tone}`}>{r.badge}</span>
                <h3 className="rb-screener-q">{r.title}</h3>
                <p className="rb-screener-help">{r.body}</p>
                <h4 className="rb-screener-next">What to do next</h4>
                <ul className="rb-check-list">
                    {r.steps.map((s) => (
                        <li key={s}>
                            <span className="rb-check"><Check size={14} /></span>
                            {s}
                        </li>
                    ))}
                </ul>
                <div className="rb-screener-actions">
                    <a className="lp-btn lp-btn-accent" href={BOOK_URL}>
                        Review this with Vybd <ArrowRight size={16} />
                    </a>
                    <button className="rb-text-btn" onClick={back}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button className="rb-text-btn" onClick={restart}>
                        <RotateCcw size={16} /> Start over
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rb-screener-card" aria-live="polite">
            <div className="rb-screener-progress" aria-hidden="true">
                <span style={{ width: `${(path.length / TOTAL_QUESTIONS) * 100}%` }} />
            </div>
            <p className="rb-screener-step">
                Question {path.length} of {TOTAL_QUESTIONS}
            </p>
            <h3 className="rb-screener-q">{question.q}</h3>
            <p className="rb-screener-help">{question.help}</p>
            <ul className="rb-options">
                {question.options.map((o) => (
                    <li key={o.label}>
                        <button onClick={() => choose(o.next)}>
                            <span>{o.label}</span>
                            <ArrowRight size={16} />
                        </button>
                    </li>
                ))}
            </ul>
            {path.length > 1 && (
                <div className="rb-screener-actions">
                    <button className="rb-text-btn" onClick={back}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button className="rb-text-btn" onClick={restart}>
                        <RotateCcw size={16} /> Start over
                    </button>
                </div>
            )}
        </div>
    );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function RobotsPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number>(0);

    useEffect(() => {
        document.title = "Foreign Robot Clearinghouse by Vybd | Bringing robots into the US";
    }, []);

    const navLinks = [
        { href: "#rules", label: "The rules" },
        { href: "#scope", label: "Who gets blocked" },
        { href: "#screener", label: "Screener" },
        { href: "#faq", label: "Fine print" },
        { href: "#approval", label: "Conditional Approval" },
    ];

    return (
        <div className="landing-page rb-page">
            {/* ── Header ── */}
            <div className="lp-header-wrapper">
                <header className="lp-header">
                    <a href="/" className="lp-logo rb-logo">
                        <span className="lp-logo-text">Vybd</span>
                        <span className="rb-logo-sub">Foreign Robot Clearinghouse</span>
                    </a>

                    <input
                        className="lp-menu-toggle"
                        type="checkbox"
                        id="lp-menu-toggle"
                        checked={menuOpen}
                        onChange={() => setMenuOpen(!menuOpen)}
                    />
                    <label className="lp-menu-btn" htmlFor="lp-menu-toggle">
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        <span className="lp-sr-only">Toggle Menu</span>
                    </label>

                    <nav className="lp-nav">
                        <ul>
                            {navLinks.map((l) => (
                                <li key={l.href}>
                                    <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="lp-header-cta">
                        <a className="lp-btn lp-btn-primary" href={BOOK_URL}>Talk to Vybd</a>
                    </div>
                </header>
                <div className="rb-announce">
                    Updated Nov 10, 2026: 15 robot product lines now hold FCC Conditional Approval.{" "}
                    <a href="#approval">See who</a>
                </div>
            </div>

            <div className="lp-mobile-sticky-cta">
                <a className="lp-btn lp-btn-primary" href={BOOK_URL}>Talk to Vybd</a>
            </div>

            <main className="rb-main">
                {/* ── Hero ── */}
                <section id="top" className="rb-hero">
                    <p className="rb-eyebrow">Vybd · Foreign Robot Clearinghouse</p>
                    <h1 className="rb-hero-title">
                        Your robot can<br />still enter.
                    </h1>
                    <p className="rb-hero-sub">
                        Since July 28, 2026, new foreign-produced mobile robots can't get FCC authorization, so they can't be
                        imported or sold in the US. But the rule is narrower than the headlines. Previously authorized models,
                        stationary machines, light devices and approved manufacturers all still have a path.
                    </p>
                    <div className="rb-hero-cta">
                        <a className="lp-btn lp-btn-accent" href="#screener">
                            Check your robot <ArrowRight size={16} />
                        </a>
                        <a className="lp-btn lp-btn-secondary" href={BOOK_URL}>Talk to Vybd</a>
                    </div>

                    <ul className="rb-status">
                        {STATUS.map((s) => (
                            <li key={s.title}>
                                <span className={`rb-tag rb-tag--${s.tone}`}>{s.tag}</span>
                                <strong>{s.title}</strong>
                                <span>{s.body}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── Rules ── */}
                <section id="rules" className="rb-section">
                    <p className="rb-eyebrow">The landscape</p>
                    <h2 className="rb-h2">
                        Two rules, not one. <span className="rb-muted">One blocks. One is still being decided.</span>
                    </h2>
                    <div className="rb-rule-grid">
                        {RULES.map((r) => (
                            <article key={r.title} className="rb-card">
                                <span className={`rb-tag rb-tag--${r.tone}`}>{r.tag}</span>
                                <h3>{r.title}</h3>
                                <p className="rb-card-date">{r.date}</p>
                                <ul className="rb-bullets">
                                    {r.points.map((p) => <li key={p}>{p}</li>)}
                                </ul>
                            </article>
                        ))}
                    </div>
                    <p className="rb-note">
                        Neither action changes existing duties. Section 301 tariffs on China-origin goods, standard customs
                        duties and product safety rules still apply, so check your HTS line.
                    </p>
                </section>

                {/* ── Scope ── */}
                <section id="scope" className="rb-section">
                    <p className="rb-eyebrow">Who gets blocked</p>
                    <h2 className="rb-h2">
                        Your robot is blocked only if <span className="rb-muted">all six of these are true.</span>
                    </h2>
                    <p className="rb-lead">
                        If even one of them doesn't describe your product, the new FCC rule doesn't apply. Your robot can enter
                        the US through normal FCC authorization.
                    </p>
                    <ol className="rb-criteria">
                        {CRITERIA.map((c, i) => (
                            <li key={c.title}>
                                <div className="rb-criteria-body">
                                    <span className="rb-criteria-num">{String(i + 1).padStart(2, "0")}</span>
                                    <h3>{c.title}</h3>
                                    <p>{c.body}</p>
                                </div>
                                <p className="rb-criteria-out">
                                    <span className="rb-check"><Check size={14} /></span>
                                    {c.out}
                                </p>
                            </li>
                        ))}
                    </ol>

                    <div className="rb-carve">
                        <h3>These can enter, whatever their specs</h3>
                        <ul className="rb-check-list">
                            {CARVE_OUTS.map((c) => (
                                <li key={c}>
                                    <span className="rb-check"><Check size={14} /></span>
                                    {c}
                                </li>
                            ))}
                        </ul>
                        <p>
                            Drones aren't on this list. The robot rule doesn't apply to them, but a separate FCC drone rule has
                            blocked new foreign drone models since December 2025.
                        </p>
                        <p>
                            Consumer products get no special pass. An entirely new robot vacuum, lawn mower or companion robot
                            which satisfies all six items is likely blocked, for instance.
                        </p>
                    </div>
                </section>

                {/* ── Screener ── */}
                <section id="screener" className="rb-section rb-screener">
                    <div className="rb-screener-intro">
                        <p className="rb-eyebrow">Screener</p>
                        <h2 className="rb-h2">Where does your robot stand?</h2>
                        <p className="rb-lead">
                            Up to five questions based on the published FCC and DoW criteria. A first read, not a legal opinion.
                        </p>
                    </div>
                    <Screener />
                </section>

                {/* ── FAQ ── */}
                <section id="faq" className="rb-section rb-split">
                    <div className="rb-split-head">
                        <p className="rb-eyebrow">The fine print</p>
                        <h2 className="rb-h2">
                            What the rule actually means <span className="rb-muted">for your company.</span>
                        </h2>
                    </div>
                    <div className="rb-faq">
                        {FAQ.map((f, i) => {
                            const open = openFaq === i;
                            return (
                                <div key={f.q} className={`rb-faq-item${open ? " is-open" : ""}`}>
                                    <button
                                        className="rb-faq-q"
                                        aria-expanded={open}
                                        onClick={() => setOpenFaq(open ? -1 : i)}
                                    >
                                        <span>{f.q}</span>
                                        <Plus size={20} className="rb-faq-icon" />
                                    </button>
                                    {open && <p className="rb-faq-a">{f.a}</p>}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ── Conditional Approval ── */}
                <section id="approval" className="rb-section">
                    <p className="rb-eyebrow">The way in</p>
                    <h2 className="rb-h2">
                        Conditional Approval <span className="rb-muted">is how new models get through.</span>
                    </h2>
                    <p className="rb-lead">
                        The DoW can find that a specific device, or a whole product class, does not pose an unacceptable risk.
                        Approved devices are no longer blocked and can go through normal FCC authorization. The approval lasts
                        only as long as the company keeps to its onshoring plan and passes continued vetting.
                    </p>

                    <div className="rb-approval-grid">
                        <div className="rb-card">
                            <h3>What the application asks for</h3>
                            <dl className="rb-dl">
                                {APPLICATION.map((a) => (
                                    <div key={a.term}>
                                        <dt>{a.term}</dt>
                                        <dd>{a.desc}</dd>
                                    </div>
                                ))}
                            </dl>
                            <p className="rb-note">
                                Applications go to <a href="mailto:conditional-approvals@fcc.gov">conditional-approvals@fcc.gov</a> as a
                                machine-readable PDF.
                            </p>
                        </div>

                        <div className="rb-card rb-approvals">
                            <div className="rb-stat">
                                <span className="rb-stat-num">15</span>
                                <span className="rb-stat-label">Robot approvals so far</span>
                            </div>
                            <div className="rb-table-wrap">
                                <table className="rb-table">
                                    <caption className="lp-sr-only">Robot approvals so far</caption>
                                    <thead>
                                        <tr>
                                            <th scope="col">Company</th>
                                            <th scope="col">Approved products</th>
                                            <th scope="col">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {APPROVALS.map(([company, products, date]) => (
                                            <tr key={company}>
                                                <th scope="row">{company}</th>
                                                <td>{products}</td>
                                                <td className="rb-nowrap">{date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <a className="rb-source" href={FCC_LIST_URL} target="_blank" rel="noreferrer">
                                15 product lines as of November 6, 2026. Source: FCC Covered List.
                            </a>
                        </div>
                    </div>
                </section>

                {/* ── Timeline ── */}
                <section id="timeline" className="rb-section rb-split">
                    <div className="rb-split-head">
                        <p className="rb-eyebrow">Timeline</p>
                        <h2 className="rb-h2">
                            How we got here, <span className="rb-muted">and what's next.</span>
                        </h2>
                    </div>
                    <ol className="rb-timeline">
                        {TIMELINE.map((t) => (
                            <li key={t.date} className={t.upcoming ? "is-upcoming" : ""}>
                                <div className="rb-timeline-meta">
                                    <time>{t.date}</time>
                                    {t.upcoming && <span className="rb-tag rb-tag--amber">Upcoming</span>}
                                </div>
                                <h3>{t.title}</h3>
                                <p>{t.body}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* ── Work with Vybd ── */}
                <section id="work" className="rb-section rb-work">
                    <div className="rb-work-top">
                        <div>
                            <p className="rb-eyebrow">Work with Vybd</p>
                            <h2 className="rb-h2">
                                Entry can still happen.<br />
                                <span className="rb-muted">Let's find your route.</span>
                            </h2>
                            <p className="rb-lead">
                                Vybd already handles market research, importer of record, compliance, freight and customs for
                                makers selling into the US. The Clearinghouse applies that to robots. We work out which route
                                fits your product, then we do the work.
                            </p>
                            <div className="rb-hero-cta">
                                <a className="lp-btn lp-btn-accent" href={BOOK_URL}>
                                    Book a clearance review <ArrowRight size={16} />
                                </a>
                                <a className="lp-btn lp-btn-secondary" href={US_URL}>See Vybd for the US</a>
                            </div>
                        </div>
                        <img
                            className="rb-work-img"
                            src="/robots/robot-crate.jpg"
                            alt="A white quadruped robot standing beside an open wooden shipping crate in a warehouse"
                            loading="lazy"
                        />
                    </div>
                    <ul className="rb-routes">
                        {ROUTES.map((r) => (
                            <li key={r.title} className="rb-card">
                                <p className="rb-route-when">{r.when}</p>
                                <h3>{r.title}</h3>
                                <p>{r.body}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className="rb-footer">
                <div className="rb-footer-inner">
                    <div className="rb-footer-about">
                        <a href="/" className="lp-logo rb-logo">
                            <span className="lp-logo-text">Vybd</span>
                            <span className="rb-logo-sub">Foreign Robot Clearinghouse</span>
                        </a>
                        <p>
                            The Foreign Robot Clearinghouse is an information service from Vybd, current as of November 10,
                            2026. It is not legal advice. Rules and Conditional Approvals change often, so confirm your
                            product’s status with counsel and the FCC before you ship.
                        </p>
                    </div>
                    <div className="rb-footer-sources">
                        <h2>Primary sources</h2>
                        <ul>
                            {SOURCES.map((s) => (
                                <li key={s.href}>
                                    <a href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="rb-footer-bottom">
                    <span>A Vybd service</span>
                    <span>© 2026 Vybd. All rights reserved.</span>
                    <div className="lp-footer-legal">
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
