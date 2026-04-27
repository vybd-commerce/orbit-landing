import type { CaseStudyMetric } from "../../data/caseStudies";

type MetricItemProps = {
  metric: CaseStudyMetric;
};

export default function MetricItem({ metric }: MetricItemProps) {
  return (
    <div className="case-metric-item">
      <span className="case-metric-value">{metric.value}</span>
      <span className="case-metric-label">{metric.label}</span>
    </div>
  );
}
