import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProductPage from "./pages/ProductPage";
import MarkdownPage from "./pages/MarkdownPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import CaseStudyDetailPage from "./pages/CaseStudyDetailPage";
import LabPage from "./pages/LabPage";
import WorkIndexPage from "./pages/WorkIndexPage";
import BayangromCaseStudyPage from "./pages/BayangromCaseStudyPage";
import MockLandingPage from "./pages/MockLandingPage";
import V2LandingPage from "./pages/V2LandingPage";
import V3LandingPage from "./pages/V3LandingPage";
import ConsultingPage from "./pages/ConsultingPage";
import WaitlistPage from "./pages/WaitlistPage";
import HelloPage from "./pages/HelloPage";
import BookPage from "./pages/BookPage";
import BookThanksPage from "./pages/BookThanksPage";
import LocaleScope from "./i18n/LocaleScope";
import { LOCALES, localePath } from "./i18n/locales";

/* The stack narrative pulls in three, R3F and drei. Kept out of the main
   bundle — it is one route, and a heavy one. */
const StackPage = lazy(() => import("./pages/StackPage"));

function App() {
  return (
    <Router>
      <Routes>
        {/* The root and booking pages, in every language: / and /book in
            English, /zh, /zh/book and so on for the rest (see src/i18n). */}
        {LOCALES.flatMap((locale) => [
          <Route key={`${locale}-home`} path={localePath(locale, "/")} element={<LocaleScope locale={locale}><HelloPage /></LocaleScope>} />,
          <Route key={`${locale}-book`} path={localePath(locale, "/book")} element={<LocaleScope locale={locale}><BookPage /></LocaleScope>} />,
          <Route key={`${locale}-thanks`} path={localePath(locale, "/book/thanks")} element={<LocaleScope locale={locale}><BookThanksPage /></LocaleScope>} />,
        ])}
        {/* Root with the 360° ring variant of the "why it's hard" section, under review. */}
        <Route path="/ring" element={<LocaleScope locale="en"><HelloPage complexity="ring" /></LocaleScope>} />
        {/* The root's address while it was in review */}
        <Route path="/hello" element={<Navigate to="/" replace />} />
        {/* Previous root, back at its own address */}
        <Route path="/waitlist" element={<WaitlistPage />} />
        {/* Previous root, kept reachable at its own address */}
        <Route path="/v4" element={<V3LandingPage />} />
        {/* Earlier roots, kept reachable while the new one settles */}
        <Route path="/old" element={<MockLandingPage />} />
        {/* The V3 page's original address, now served at /v4 */}
        <Route path="/v3" element={<Navigate to="/v4" replace />} />
        {/* Earlier landing page, kept here for reference */}
        <Route path="/mock" element={<LandingPage />} />
        {/* Ops cost curve rebuild, see docs/edits.md */}
        <Route path="/v2" element={<V2LandingPage />} />
        <Route
          path="/stack"
          element={
            <Suspense fallback={null}>
              <StackPage />
            </Suspense>
          }
        />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/consulting" element={<ConsultingPage />} />
        {/* Journey story variant, under review. */}
        <Route path="/consulting/journey" element={<ConsultingPage story="journey" />} />
        {/* Simplified line-art story variant, under review. */}
        <Route path="/consulting/flow" element={<ConsultingPage story="flow" />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
        <Route path="/case-study" element={<Navigate to="/case-studies" replace />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/work" element={<WorkIndexPage />} />
        <Route path="/work/bayangrom" element={<BayangromCaseStudyPage />} />
        <Route path="/privacy" element={<MarkdownPage title="Privacy Policy" filePath="/privacy.md" />} />
        <Route path="/terms" element={<MarkdownPage title="Terms of Service" filePath="/terms.md" />} />
      </Routes>
    </Router>
  );
}

export default App;
