import { useState, useEffect } from 'react'

function calculate(targetDate) {
  const diffMs = new Date(targetDate) - Date.now()
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0, expired: true }
  }
  const days = Math.floor(diffMs / 86400000)
  const hours = Math.floor((diffMs % 86400000) / 3600000)
  const minutes = Math.floor((diffMs % 3600000) / 60000)
  const seconds = Math.floor((diffMs % 60000) / 1000)
  const totalHours = Math.floor(diffMs / 3600000)
  return { days, hours, minutes, seconds, totalHours, expired: false }
}

export function useCountdown(targetDate) {
  const [time, setTime] = useState(() => calculate(targetDate))

  useEffect(() => {
    const id = setInterval(() => setTime(calculate(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return time
}
