import type { CaseStudy } from "../../data/caseStudies";
import CaseStudyCard from "./CaseStudyCard";

type CaseStudiesSectionProps = {
  title?: string;
  intro?: string;
  items: CaseStudy[];
};

export default function CaseStudiesSection({
  title = "Case Studies",
  intro = "See how we help organizations build and scale with data-driven market entry strategies.",
  items,
}: CaseStudiesSectionProps) {
  return (
    <section className="case-studies-section">
      <div className="case-studies-header">
        <span className="case-eyebrow">Case Studies</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>

      <div className="case-studies-grid">
        {items.map((caseStudy) => (
          <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
        ))}
      </div>
    </section>
  );
}
