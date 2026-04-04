import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AppShell from './components/AppShell'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AssignmentDetail from './pages/AssignmentDetail'
import Orientation from './pages/Orientation'
import SubmitPage from './pages/submit/SubmitPage'
import Validating from './pages/validation/Validating'
import SubmissionSummary from './pages/validation/SubmissionSummary'
import ConsentScreen from './pages/consent/ConsentScreen'
import ReconsiderationWindow from './pages/consent/ReconsiderationWindow'
import TargetedFix from './pages/fix/TargetedFix'
import ResubmitValidating from './pages/fix/ResubmitValidating'
import StatusDashboard from './pages/StatusDashboard'

// Simple auth check (prototype only — localStorage flag)
function RequireAuth({ children }) {
  const isAuth = localStorage.getItem('educaitors_auth') === 'true'
  const location = useLocation()
  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter basename="/EducAItors">
      <Routes>
        {/* Login — outside AppShell (no sidebar/header) */}
        <Route path="/login" element={<Login />} />

        {/* All authenticated routes — wrapped in AppShell */}
        <Route path="/*" element={
          <RequireAuth>
            <AppShell>
              <Routes>
                {/* Dashboard — academic overview */}
                <Route path="/" element={<Dashboard />} />

                {/* Assignment detail — full brief, tabs, CTA */}
                <Route path="/assignment" element={<AssignmentDetail />} />

                {/* Orientation walkthrough */}
                <Route path="/orientation" element={<Orientation />} />

                {/* Submission building */}
                <Route path="/submit" element={<SubmitPage />} />

                {/* Validation & Summary */}
                <Route path="/submit/validating" element={<Validating />} />
                <Route path="/result/summary" element={<SubmissionSummary />} />

                {/* Consent flow */}
                <Route path="/consent" element={<ConsentScreen />} />
                <Route path="/consent/reconsideration" element={<ReconsiderationWindow />} />

                {/* Resubmission */}
                <Route path="/fix" element={<TargetedFix />} />
                <Route path="/fix/validating" element={<ResubmitValidating />} />

                {/* Post-submission status */}
                <Route path="/status" element={<StatusDashboard />} />
              </Routes>
            </AppShell>
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  )
}
