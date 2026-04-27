import { Link } from "react-router-dom";
import type { CaseStudy } from "../../data/caseStudies";
import MetricItem from "./MetricItem";

type CaseStudyCardProps = {
  caseStudy: CaseStudy;
};

export default function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Link to={`/case-studies/${caseStudy.slug}`} className="case-study-card">
      <div className="case-study-card-image-wrap">
        <img
          src={caseStudy.image}
          alt={caseStudy.title}
          className="case-study-card-image"
          loading="lazy"
        />
      </div>

      <div className="case-study-card-content">
        <span className="case-study-category">{caseStudy.category}</span>
        <h3>{caseStudy.title}</h3>
        <p>{caseStudy.summary}</p>

        <div className="case-study-metrics">
          {caseStudy.metrics.map((metric) => (
            <MetricItem key={`${caseStudy.slug}-${metric.label}`} metric={metric} />
          ))}
        </div>
      </div>
    </Link>
  );
}
