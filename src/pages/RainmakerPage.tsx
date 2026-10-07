import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, BadgePercent, Handshake, Languages, PieChart, Ship, TrendingUp } from "lucide-react";
import { track } from "../lib/analytics";
import "./RainmakerPage.css";

/* ── Content (edit here) ─────────────────────────────────────────────────
   English, Chinese and Korean, at /rainmaker, /zh/rainmaker and
   /ko/rainmaker. Applications go out as a pre-filled email: no form backend
   exists yet, and a mailto works from mainland China too. The email itself
   stays in English for the team reading it. */
const APPLY_EMAIL = "hello@vybd.ai";

export type RainmakerLocale = "en" | "zh" | "ko";

const LANGS: { locale: RainmakerLocale; label: string; lang: string; path: string }[] = [
    { locale: "en", label: "English", lang: "en", path: "/rainmaker" },
    { locale: "zh", label: "中文", lang: "zh-CN", path: "/zh/rainmaker" },
    { locale: "ko", label: "한국어", lang: "ko", path: "/ko/rainmaker" },
];

const FLAGS = ["cn", "kr", "in", "jp", "vn"] as const;

const ROLE_ICONS = [Handshake, Languages, Ship];
const EARN_ICONS = [BadgePercent, TrendingUp, PieChart];

const COPY = {
    en: {
        seoTitle: "Become a Vybd Rainmaker | Local partners",
        seoDescription:
            "Represent Vybd in your country. Bring manufacturers and brands to the US market and earn commission, a share of revenue or profit, or part ownership.",
        home: "/",
        flags: { cn: "China", kr: "South Korea", in: "India", jp: "Japan", vn: "Vietnam" },
        label: "Rainmaker program",
        title: "Bring brands from your country to the US. Earn as they grow.",
        sub: "We're looking for local representatives in China, South Korea, India and beyond: people who know the makers and brands in their market and want to help them sell in America.",
        roleHead: "What you do",
        role: [
            "Introduce us to manufacturers and brands that are ready for the US.",
            "Be their local point of contact, in their language and time zone.",
            "We handle the US side: the plan, compliance, logistics and operations.",
        ],
        earnHead: "How you earn",
        earn: [
            { title: "Commission", text: "On every brand you bring that starts working with us." },
            { title: "Revenue or profit share", text: "A share of the brand's US revenue or profit as it grows." },
            { title: "Part ownership", text: "Equity in the brands you help build in the US." },
        ],
        note: "The mix depends on the brand and your role. We agree it in writing before you start.",
        applyTitle: "Apply to be a Rainmaker",
        name: "Full name",
        email: "Email",
        location: "Country and city",
        locationPlaceholder: "Shenzhen, China",
        chat: "WeChat, KakaoTalk or WhatsApp",
        optional: "(optional)",
        network: "Which industries or brands do you know?",
        networkPlaceholder: "Skincare makers in Seoul, electronics factories in Shenzhen…",
        link: "LinkedIn or website",
        submit: "Send application",
        fine: "This opens your email app with your answers filled in. Prefer to write yourself? Email",
        sent: "Your email app should now be open with your application filled in. Send it, and we'll reply within a few days. Nothing opened? Email us at",
        end: ".",
    },
    zh: {
        seoTitle: "成为 Vybd 本地合作伙伴 | Rainmaker 计划",
        seoDescription:
            "在您的国家代表 Vybd。把制造商和品牌带进美国市场，获得佣金、收入或利润分成，或品牌股权。",
        home: "/zh",
        flags: { cn: "中国", kr: "韩国", in: "印度", jp: "日本", vn: "越南" },
        label: "Rainmaker 合作伙伴计划",
        title: "把本地品牌带进美国，随品牌成长一起获益。",
        sub: "我们正在中国、韩国、印度等地寻找本地代表：熟悉当地制造商和品牌，并愿意帮助它们进入美国市场的人。",
        roleHead: "您的工作",
        role: [
            "为我们引荐准备好进入美国的制造商和品牌。",
            "用他们的语言、在他们的时区，担任本地对接人。",
            "美国这边由我们负责：市场方案、合规、物流和运营。",
        ],
        earnHead: "您的收益",
        earn: [
            { title: "佣金", text: "每带来一个与我们签约合作的品牌，您都能获得佣金。" },
            { title: "收入或利润分成", text: "随着品牌在美国成长，分享其美国收入或利润。" },
            { title: "品牌股权", text: "在您协助打造的品牌中持有部分股权。" },
        ],
        note: "具体组合取决于品牌和您的角色，开始合作前我们会以书面形式约定。",
        applyTitle: "申请成为 Rainmaker",
        name: "姓名",
        email: "邮箱",
        location: "国家和城市",
        locationPlaceholder: "中国深圳",
        chat: "微信、KakaoTalk 或 WhatsApp",
        optional: "（选填）",
        network: "您熟悉哪些行业或品牌？",
        networkPlaceholder: "深圳的电子工厂、首尔的护肤品制造商……",
        link: "LinkedIn 或网站",
        submit: "发送申请",
        fine: "点击后会打开您的邮件应用，并自动填好您的信息。也可以直接发邮件至",
        sent: "您的邮件应用应该已经打开，申请内容已填好。发送后，我们会在几天内回复。没有打开？请直接发邮件至",
        end: "。",
    },
    ko: {
        seoTitle: "Vybd 현지 파트너 모집 | Rainmaker 프로그램",
        seoDescription:
            "당신의 나라에서 Vybd를 대표하세요. 제조사와 브랜드의 미국 진출을 연결하고 커미션, 매출 또는 수익 배분, 브랜드 지분을 받으세요.",
        home: "/ko",
        flags: { cn: "중국", kr: "대한민국", in: "인도", jp: "일본", vn: "베트남" },
        label: "Rainmaker 파트너 프로그램",
        title: "당신 나라의 브랜드를 미국으로. 브랜드와 함께 성장하세요.",
        sub: "중국, 한국, 인도 등에서 현지 대표를 찾고 있습니다. 현지 제조사와 브랜드를 잘 알고, 그들의 미국 판매를 돕고 싶은 분을 기다립니다.",
        roleHead: "하는 일",
        role: [
            "미국 진출 준비가 된 제조사와 브랜드를 저희에게 소개합니다.",
            "그들의 언어와 시간대로 현지 담당자 역할을 합니다.",
            "미국 쪽은 저희가 맡습니다: 진출 계획, 규제 대응, 물류, 운영.",
        ],
        earnHead: "수익 구조",
        earn: [
            { title: "커미션", text: "소개한 브랜드가 저희와 계약할 때마다 지급됩니다." },
            { title: "매출 또는 수익 배분", text: "브랜드가 성장할수록 미국 매출 또는 수익의 일부를 나눕니다." },
            { title: "브랜드 지분", text: "함께 키운 브랜드의 지분 일부를 받습니다." },
        ],
        note: "구성은 브랜드와 역할에 따라 달라지며, 시작 전에 서면으로 합의합니다.",
        applyTitle: "Rainmaker 지원하기",
        name: "이름",
        email: "이메일",
        location: "국가 및 도시",
        locationPlaceholder: "대한민국 서울",
        chat: "WeChat, 카카오톡 또는 WhatsApp",
        optional: "(선택)",
        network: "잘 아는 업종이나 브랜드는 무엇인가요?",
        networkPlaceholder: "서울의 스킨케어 제조사, 선전의 전자제품 공장…",
        link: "LinkedIn 또는 웹사이트",
        submit: "지원서 보내기",
        fine: "버튼을 누르면 입력한 내용이 채워진 이메일 앱이 열립니다. 직접 작성하고 싶다면 이메일로 보내 주세요:",
        sent: "이메일 앱이 열리고 지원서가 채워졌을 거예요. 보내 주시면 며칠 안에 답변드리겠습니다. 열리지 않았나요? 이메일로 보내 주세요:",
        end: "",
    },
};

type Fields = { name: string; email: string; location: string; chat: string; network: string; link: string };
const EMPTY: Fields = { name: "", email: "", location: "", chat: "", network: "", link: "" };

function mailtoFor(f: Fields) {
    const body = [
        `Name: ${f.name}`,
        `Email: ${f.email}`,
        `Country and city: ${f.location}`,
        `WeChat / KakaoTalk / WhatsApp: ${f.chat || "-"}`,
        `LinkedIn or website: ${f.link || "-"}`,
        "",
        "Industries and brands I know:",
        f.network,
    ].join("\n");
    const subject = `Rainmaker application: ${f.name} (${f.location})`;
    return `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* /rainmaker: recruits local representatives outside the US. Pitch on the
   left, a short application on the right; stacked on phones. */
export default function RainmakerPage({ locale = "en" }: { locale?: RainmakerLocale }) {
    const c = COPY[locale];
    const [fields, setFields] = useState<Fields>(EMPTY);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const html = document.documentElement;
        const prevLang = html.lang;
        html.lang = LANGS.find((l) => l.locale === locale)!.lang;
        const prevTitle = document.title;
        document.title = c.seoTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        const prevDesc = metaDesc?.getAttribute("content") ?? null;
        metaDesc?.setAttribute("content", c.seoDescription);
        return () => {
            html.lang = prevLang;
            document.title = prevTitle;
            if (metaDesc && prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
        };
    }, [locale, c]);

    const set = (k: keyof Fields) => (e: { target: { value: string } }) => setFields((f) => ({ ...f, [k]: e.target.value }));

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        track("rainmaker_apply", { country: fields.location, lang: locale });
        window.location.href = mailtoFor(fields);
        setSent(true);
    }

    return (
        <main className="rm-page">
            <div className="rm-panel">
                <section className="rm-info">
                    <div className="rm-top">
                        <a href={c.home} className="rm-back">
                            <ArrowLeft aria-hidden="true" />
                            Vybd
                        </a>
                        <nav className="rm-langs" aria-label="Language">
                            {LANGS.map((l) => (
                                <a
                                    key={l.locale}
                                    href={l.path}
                                    lang={l.lang}
                                    aria-current={l.locale === locale ? "page" : undefined}
                                >
                                    {l.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <p className="rm-label">{c.label}</p>
                    <h1 className="rm-title">{c.title}</h1>
                    <p className="rm-sub">{c.sub}</p>
                    <div className="rm-flags">
                        {FLAGS.map((code) => (
                            <img key={code} src={`/images/flags/${code}.svg`} alt={c.flags[code]} width={32} height={32} />
                        ))}
                    </div>

                    <h2 className="rm-head">{c.roleHead}</h2>
                    <ul className="rm-role">
                        {c.role.map((text, i) => {
                            const Icon = ROLE_ICONS[i];
                            return (
                                <li key={text}>
                                    <Icon aria-hidden="true" />
                                    <span>{text}</span>
                                </li>
                            );
                        })}
                    </ul>

                    <h2 className="rm-head">{c.earnHead}</h2>
                    <ul className="rm-earn">
                        {c.earn.map(({ title, text }, i) => {
                            const Icon = EARN_ICONS[i];
                            return (
                                <li key={title}>
                                    <Icon aria-hidden="true" />
                                    <h3>{title}</h3>
                                    <p>{text}</p>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="rm-note">{c.note}</p>
                </section>

                <section className="rm-apply" aria-labelledby="rm-apply-title">
                    <h2 id="rm-apply-title" className="rm-apply-title">
                        {c.applyTitle}
                    </h2>
                    {sent ? (
                        <p className="rm-sent" role="status">
                            {c.sent} <a href={mailtoFor(fields)}>{APPLY_EMAIL}</a>
                            {c.end}
                        </p>
                    ) : (
                        <form className="rm-form" onSubmit={handleSubmit}>
                            <label>
                                <span>{c.name}</span>
                                <input required autoComplete="name" value={fields.name} onChange={set("name")} />
                            </label>
                            <label>
                                <span>{c.email}</span>
                                <input required type="email" autoComplete="email" value={fields.email} onChange={set("email")} />
                            </label>
                            <label>
                                <span>{c.location}</span>
                                <input required placeholder={c.locationPlaceholder} value={fields.location} onChange={set("location")} />
                            </label>
                            <label>
                                <span>
                                    {c.chat} <em>{c.optional}</em>
                                </span>
                                <input value={fields.chat} onChange={set("chat")} />
                            </label>
                            <label>
                                <span>{c.network}</span>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder={c.networkPlaceholder}
                                    value={fields.network}
                                    onChange={set("network")}
                                />
                            </label>
                            <label>
                                <span>
                                    {c.link} <em>{c.optional}</em>
                                </span>
                                <input type="url" placeholder="https://" value={fields.link} onChange={set("link")} />
                            </label>
                            <button type="submit" className="rm-submit">
                                {c.submit}
                                <ArrowRight aria-hidden="true" strokeWidth={2.25} />
                            </button>
                            <p className="rm-fine">
                                {c.fine} <a href={`mailto:${APPLY_EMAIL}`}>{APPLY_EMAIL}</a>
                                {c.end}
                            </p>
                        </form>
                    )}
                </section>
            </div>
        </main>
    );
}
