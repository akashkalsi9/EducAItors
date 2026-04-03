/**
 * AIInstructorStatement
 *
 * Persistent trust statement — always visible, never collapsed.
 * Used on screens 3.3, 3.4, 3.5, 4.1, 6.1.
 *
 * Props:
 *   centered  — boolean — centers text alignment (default: false, left-aligned)
 */
export default function AIInstructorStatement({ centered = false }) {
  return (
    <p
      className={`text-[14px] text-muted leading-relaxed ${
        centered ? 'text-center' : 'text-left'
      }`}
    >
      AI will process your work.{' '}
      <span className="font-semibold text-foreground">
        Your instructor makes the final grade decision.
      </span>
    </p>
  )
}
