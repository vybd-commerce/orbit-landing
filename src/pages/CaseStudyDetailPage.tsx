import { Link, Navigate, useParams } from "react-router-dom";
import MetricItem from "../components/case-studies/MetricItem";
import { caseStudies } from "../data/caseStudies";
import "./CaseStudies.css";

export default function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const caseStudy = caseStudies.find((item) => item.slug === slug);

  if (!caseStudy) {
    return <Navigate to="/case-studies" replace />;
  }

  return (
    <main className="case-page-shell">
      <article className="case-detail-page">
        <Link to="/case-studies" className="case-back-link">
          ← Back to case studies
        </Link>

        <header className="case-detail-header">
          <span className="case-study-category">{caseStudy.category}</span>
          <h1>{caseStudy.title}</h1>
          <p>{caseStudy.summary}</p>
        </header>

        <img
          src={caseStudy.image}
          alt={caseStudy.title}
          className="case-detail-hero"
        />

        <section className="case-detail-metrics">
          {caseStudy.metrics.map((metric) => (
            <MetricItem key={`${caseStudy.slug}-detail-${metric.label}`} metric={metric} />
          ))}
        </section>

        <section className="case-detail-content">
          <div className="case-detail-block">
            <h2>Overview</h2>
            <p>{caseStudy.details.overview}</p>
          </div>

          <div className="case-detail-block">
            <h2>Role</h2>
            <p>{caseStudy.details.role}</p>
          </div>

          <div className="case-detail-block">
            <h2>Challenges</h2>
            <ul>
              {caseStudy.details.challenges.map((challenge) => (
                <li key={challenge}>{challenge}</li>
              ))}
            </ul>
          </div>

          <div className="case-detail-block">
            <h2>Solutions</h2>
            <ul>
              {caseStudy.details.solutions.map((solution) => (
                <li key={solution}>{solution}</li>
              ))}
            </ul>
          </div>

          <div className="case-detail-block">
            <h2>Impact</h2>
            <p>{caseStudy.details.impact}</p>
          </div>

          {caseStudy.details.ctaTitle && caseStudy.details.ctaText ? (
            <div className="case-cta-card">
              <h3>{caseStudy.details.ctaTitle}</h3>
              <p>{caseStudy.details.ctaText}</p>
            </div>
          ) : null}
        </section>
      </article>
    </main>
  );
}
