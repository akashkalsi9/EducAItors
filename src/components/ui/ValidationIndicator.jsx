/**
 * ValidationIndicator
 *
 * Circle icon — same shape family across all validation states.
 * ONLY the fill color and inner mark change between variants.
 * This is intentional — visual system consistency.
 *
 * Variants: 'ready' | 'warning' | 'blocker'
 * Size: 56px (default) — set via the size prop
 *
 * Used on: 3.3, 3.4, 3.5
 */

const CONFIG = {
  ready: {
    colorClass: 'text-success',
    ringClass:  'ring-success-soft',
    ariaLabel:  'Validation passed',
  },
  warning: {
    colorClass: 'text-warning',
    ringClass:  'ring-warning-soft',
    ariaLabel:  'Warning — needs attention',
  },
  blocker: {
    colorClass: 'text-danger',
    ringClass:  'ring-danger-soft',
    ariaLabel:  'Cannot proceed — fix required',
  },
}

export default function ValidationIndicator({ variant = 'warning', size = 56, ringClassName = 'ring-4' }) {
  const { colorClass, ringClass, ariaLabel } = CONFIG[variant] ?? CONFIG.warning
  const cx = size / 2
  const cy = size / 2

  return (
    <div
      className={`${ringClassName} ring-offset-4 ${ringClass} rounded-full inline-flex items-center justify-center`}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        className={colorClass}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        aria-hidden="true"
      >
        {/* Three-layer circle — matches ready state shape family */}
        <circle cx={cx} cy={cy} r={cx}          fill="currentColor" fillOpacity="0.08" />
        <circle cx={cx} cy={cy} r={cx * 0.857}  fill="currentColor" fillOpacity="0.15" />
        <circle cx={cx} cy={cy} r={cx * 0.714}  fill="currentColor" />

        {/* Ready — checkmark */}
        {variant === 'ready' && (
          <path
            d={`M${cx * 0.7} ${cy}l${cx * 0.28} ${cx * 0.28}l${cx * 0.48} ${-cx * 0.52}`}
            stroke="white"
            strokeWidth={cx * 0.11}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Warning — exclamation mark: vertical bar + dot */}
        {variant === 'warning' && (
          <>
            <rect
              x={cx - cx * 0.075}
              y={cy * 0.52}
              width={cx * 0.15}
              height={cy * 0.52}
              rx={cx * 0.075}
              fill="white"
            />
            <circle
              cx={cx}
              cy={cy * 1.38}
              r={cx * 0.09}
              fill="white"
            />
          </>
        )}

        {/* Blocker — X mark */}
        {variant === 'blocker' && (
          <path
            d={`M${cx * 0.65} ${cy * 0.65}l${cx * 0.7} ${cy * 0.7}M${cx * 1.35} ${cy * 0.65}l${-cx * 0.7} ${cy * 0.7}`}
            stroke="white"
            strokeWidth={cx * 0.13}
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  )
}
