import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import { CheckCircle2, Clock, Undo2 } from 'lucide-react'
import InnerPageBar from '../../components/ui/InnerPageBar'
import { mockAssignment } from '../../data/mock-assignment'

export default function ReconsiderationWindow() {
  const navigate = useNavigate()
  const { state: routeState } = useLocation()
  const deadline = routeState?.deadline ?? mockAssignment.deadline

  // 5-minute countdown (300 seconds)
  const [secondsLeft, setSecondsLeft] = useState(300)
  const expired = secondsLeft <= 0

  useEffect(() => {
    if (expired) return
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [expired])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`

  // Progress ring percentage (300s -> 0s = 100% -> 0%)
  const progressPercent = (secondsLeft / 300) * 100

  return (
    <>
      <InnerPageBar title="Submission Sent" deadline={deadline} />

      <div className="h-[calc(100vh-64px-53px)] bg-surface-secondary flex items-center justify-center px-8 lg:px-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="rounded-2xl border border-border p-0 gap-0">
            <CardContent className="p-8 gap-0 flex flex-col items-center text-center">

              {/* Success icon */}
              <div className="w-16 h-16 rounded-full bg-success-soft flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" aria-hidden="true" />
              </div>

              <h1 className="text-[22px] font-bold text-foreground mt-5">
                {expired ? 'Submission locked' : 'Submission sent'}
              </h1>

              {!expired ? (
                <>
                  <p className="text-[14px] text-muted mt-2">
                    You can undo this within the next 5 minutes.
                  </p>

                  {/* Timer */}
                  <div className="mt-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" aria-hidden="true" />
                    <span className="text-[28px] font-bold text-foreground tracking-tight">{timeDisplay}</span>
                    <span className="text-[13px] text-muted">remaining</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-accent rounded-full"
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: 'linear' }}
                    />
                  </div>

                  {/* Reassurance */}
                  <p className="text-[13px] text-muted mt-5">
                    Your instructor hasn't seen this yet.
                  </p>

                  {/* CTAs */}
                  <div className="mt-6 flex items-center gap-3 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg flex-1 gap-2"
                      onPress={() => navigate('/result/analysis')}
                    >
                      <Undo2 className="w-4 h-4" aria-hidden="true" />
                      Undo submission
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-lg flex-1 font-semibold"
                      onPress={() => navigate('/status')}
                    >
                      Done
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[14px] text-muted mt-2">
                    Your submission is now with your instructor for evaluation.
                  </p>

                  <div className="mt-6 w-full">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      className="rounded-lg font-semibold"
                      onPress={() => navigate('/status')}
                    >
                      Return to dashboard
                    </Button>
                  </div>
                </>
              )}

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
