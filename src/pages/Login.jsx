/**
 * Login — Simple branded login page.
 * No real auth — clicking Sign In navigates to Dashboard.
 * Route: /login (rendered outside AppShell — no sidebar/header)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Card, CardContent } from '@heroui/react'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [email]     = useState('riya.sharma@university.edu')
  const [password]  = useState('password123')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSignIn() {
    setLoading(true)
    localStorage.setItem('educaitors_auth', 'true')
    setTimeout(() => navigate('/'), 800)
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-extrabold tracking-tight">
            <span className="text-foreground">Educ</span>
            <span className="ai-gradient-text">AI</span>
            <span className="text-foreground">tors</span>
          </h1>
          <p className="text-[13px] text-muted mt-1">Student Submission Portal</p>
        </div>

        {/* Login card */}
        <Card className="rounded-2xl border border-border p-0 gap-0">
          <CardContent className="p-6 gap-0">
            <h2 className="text-[18px] font-bold text-foreground text-center">
              Sign in to your account
            </h2>
            <p className="text-[13px] text-muted text-center mt-1">
              Use your university credentials
            </p>

            {/* Form */}
            <div className="mt-6 flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="text-[12px] font-semibold text-foreground mb-1.5 block">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full h-11 rounded-lg border border-border bg-surface-secondary px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[12px] font-semibold text-foreground mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    readOnly
                    className="w-full h-11 rounded-lg border border-border bg-surface-secondary px-3 pr-10 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw
                      ? <EyeOff className="w-4 h-4" strokeWidth={2} />
                      : <Eye    className="w-4 h-4" strokeWidth={2} />
                    }
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <button type="button" className="text-[12px] text-accent hover:underline">
                  Forgot password?
                </button>
              </div>

              {/* Sign in button */}
              <Button
                variant="primary"
                fullWidth
                className="rounded-lg font-semibold h-11"
                isPending={loading}
                onPress={handleSignIn}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-[11px] text-muted/60 text-center mt-6 leading-relaxed">
          AI will process your work. Your instructor makes the final grade decision.
        </p>
      </motion.div>
    </div>
  )
}
