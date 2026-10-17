import { useEffect, useRef } from "react";
import type { Locale } from "../i18n/locales";

declare global {
    interface Window {
        Trustpilot?: { loadFromElement: (el: HTMLElement, forceReload?: boolean) => void };
    }
}

/* Trustbox language for each site locale. */
const TP_LOCALE: Record<Locale, string> = {
    en: "en-US",
    zh: "zh-CN",
    ko: "ko-KR",
    ja: "ja-JP",
    fr: "fr-FR",
    es: "es-ES",
};

/* Trustpilot "Review Collector" TrustBox. The bootstrap script (index.html)
   only scans the page once on load, so on client-side navigation the widget
   is initialised here. Before the script arrives, the plain link shows. */
export default function TrustpilotWidget({ locale = "en" }: { locale?: Locale }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && window.Trustpilot) window.Trustpilot.loadFromElement(ref.current, true);
    }, [locale]);

    return (
        <div
            ref={ref}
            className="trustpilot-widget"
            data-locale={TP_LOCALE[locale]}
            data-template-id="56278e9abfbbba0bdcd568bc"
            data-businessunit-id="6ac82643be67e4fd7bdb0aae"
            data-style-height="52px"
            data-style-width="100%"
            data-token="96f14098-3e5d-476a-97e0-683435474038"
        >
            <a href="https://www.trustpilot.com/review/vybd.ai" target="_blank" rel="noopener">
                Trustpilot
            </a>
        </div>
    );
}
