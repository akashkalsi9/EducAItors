// Screen 1.2 — First-Submission Orientation
// Route: /orientation
// Persona: Riya (anxious first-timer) + Marcus (first-time institutional)
//
// Full-screen orientation carousel.
// On dismiss → navigate('/submit/upload').

import { useNavigate, useLocation } from 'react-router-dom'
import PageShell from '../components/PageShell'
import OrientationPanel from '../components/OrientationPanel'
import InnerPageBar from '../components/ui/InnerPageBar'
import { mockAssignment } from '../data/mock-assignment'

export default function Orientation() {
  const navigate              = useNavigate()
  const { state: routeState } = useLocation()

  const { deadline } = mockAssignment

  // Drop on panel 1 when arriving from a result failure
  const startPanel = routeState?.isFirstFailure ? 1 : 0

  function handleDismiss() {
    navigate('/submit/upload')
  }

  return (
    <>
      <InnerPageBar title="Getting Started" deadline={deadline} />
      <PageShell noPadding>

        {/* ════════════════════════════════════════════════════════════════════
            CONTENT AREA — full-screen orientation panel
            ════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 bg-surface-secondary overflow-y-auto">
          <div className="px-8 lg:px-10 py-8">
            <div className="max-w-3xl mx-auto">
              <OrientationPanel
                onDismiss={handleDismiss}
              />
            </div>
          </div>
        </div>

      </PageShell>
    </>
  )
}
