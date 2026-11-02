import type { Tx } from "../i18n";

/* Mint marquee band under the hero (.tk in HomePage.css). Each item is a
   light lead-in and a bold word ("Made in" India); every item ends in an
   arrow. Four copies so the -50% loop never shows a gap. */

export default function Ticker({ tx, items, label }: { tx: Tx; items: [string, string][]; label: string }) {
    const run = [0, 1, 2, 3].flatMap((r) => items.map(([a, b], i) => ({ key: `${r}-${i}`, a, b })));
    return (
        <div className="tk" aria-label={tx(label)}>
            <div className="tk-run" aria-hidden="true">
                {run.map(({ key, a, b }) => (
                    <span key={key}>
                        {a && tx(a)} <b>{tx(b)}</b>
                    </span>
                ))}
            </div>
        </div>
    );
}
