import CaseStudiesSection from "../components/case-studies/CaseStudiesSection";
import { caseStudies } from "../data/caseStudies";
import "./CaseStudies.css";

export default function CaseStudiesPage() {
  return (
    <main className="case-page-shell">
      <CaseStudiesSection items={caseStudies} />
    </main>
  );
}
