// formatters — date, time, file size utilities

/**
 * Human-readable file size
 * formatFileSize(1536) → "1.5 KB"
 */
export function formatFileSize(bytes) {
  if (bytes < 1024)           return `${bytes} B`
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Deadline display string
 * "April 3, 2026 at 11:59 PM"
 */
export function formatDeadline(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    month:   'long',
    day:     'numeric',
    year:    'numeric',
    hour:    'numeric',
    minute:  '2-digit',
    hour12:  true,
  })
}
