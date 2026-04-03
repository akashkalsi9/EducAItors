import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'

import Dashboard from './pages/Dashboard'
import Orientation from './pages/Orientation'
import PrimaryUpload from './pages/submit/PrimaryUpload'
import ArtifactUpload from './pages/submit/ArtifactUpload'
import LinkSubmission from './pages/submit/LinkSubmission'
import OCRPreviewPage from './pages/submit/OCRPreviewPage'
import SubmissionReview from './pages/submit/SubmissionReview'
import Validating from './pages/validation/Validating'
import ValidationReady from './pages/validation/ValidationReady'
import ValidationWarning from './pages/validation/ValidationWarning'
import ValidationBlocker from './pages/validation/ValidationBlocker'
import ConsentScreen from './pages/consent/ConsentScreen'
import ReconsiderationWindow from './pages/consent/ReconsiderationWindow'
import TargetedFix from './pages/fix/TargetedFix'
import ResubmitValidating from './pages/fix/ResubmitValidating'
import StatusDashboard from './pages/StatusDashboard'

export default function App() {
  return (
    <BrowserRouter basename="/EducAItors">
      <AppShell>
      <Routes>
        {/* Screen 1.1 — Assignment Entry */}
        <Route path="/" element={<Dashboard />} />

        {/* Screen 1.2 — First-Submission Orientation */}
        <Route path="/orientation" element={<Orientation />} />

        {/* Screens 2.x — Submission Building */}
        <Route path="/submit/upload" element={<PrimaryUpload />} />
        <Route path="/submit/artifacts" element={<ArtifactUpload />} />
        <Route path="/submit/links" element={<LinkSubmission />} />
        <Route path="/submit/ocr-preview" element={<OCRPreviewPage />} />
        <Route path="/submit/review" element={<SubmissionReview />} />

        {/* Screens 3.x — Validation & Decision */}
        <Route path="/submit/validating" element={<Validating />} />
        <Route path="/result/ready" element={<ValidationReady />} />
        <Route path="/result/warning" element={<ValidationWarning />} />
        <Route path="/result/blocker" element={<ValidationBlocker />} />

        {/* Screens 4.x — Consent Flow */}
        <Route path="/consent" element={<ConsentScreen />} />
        <Route path="/consent/reconsideration" element={<ReconsiderationWindow />} />

        {/* Screens 5.x — Resubmission */}
        <Route path="/fix" element={<TargetedFix />} />
        <Route path="/fix/validating" element={<ResubmitValidating />} />

        {/* Screen 6.1 — Post-Submission Status */}
        <Route path="/status" element={<StatusDashboard />} />
      </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
