import type { ReactNode } from "react";

/* Section opener on /enterprise: mono kicker (as on the US
   pricing section), a serif headline with a mint <em> and a lead line. */
export default function SectionTop({ kicker, title, children, center }: { kicker: string; title: ReactNode; children?: ReactNode; center?: boolean }) {
    return (
        <div className={`ent-top rv${center ? " ent-top--c" : ""}`}>
            <div className="hw2-k">{kicker}</div>
            <h2 className="h2">{title}</h2>
            {children && <p className="lead">{children}</p>}
        </div>
    );
}
