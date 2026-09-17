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

/* The stack narrative pulls in three, R3F and drei. Kept out of the main
   bundle — it is one route, and a heavy one. */
const StackPage = lazy(() => import("./pages/StackPage"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<V3LandingPage />} />
        {/* Previous root, kept reachable while the new one settles */}
        <Route path="/old" element={<MockLandingPage />} />
        {/* The root's own former address; anything already pointing here lands
            on the same page rather than a dead route. */}
        <Route path="/v3" element={<Navigate to="/" replace />} />
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
