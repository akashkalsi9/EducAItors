/**
 * PageShell — layout wrapper for every screen.
 *
 * 390px mobile frame centered on bg-soft canvas.
 * No responsive breakpoints — mobile-only by design.
 *
 * Props:
 *   children    — page content
 *   noPadding   — remove default px-4 pt-4 pb-6 from <main>
 *   phoneFrame  — wrap in decorative phone bezel (pitch/demo mode)
 */
export default function PageShell({
  children,
  noPadding = false,
  phoneFrame = false,
}) {
  const screen = (
    <div className="w-full flex flex-col relative min-h-screen">
      <main className={`flex-1 ${noPadding ? 'flex flex-col' : 'px-4 pt-4 pb-6'}`}>
        {children}
      </main>
    </div>
  )

  if (phoneFrame) {
    return (
      <div className="min-h-screen bg-surface-secondary flex justify-center items-start py-10">
        <div className="relative">
          {/* Outer shell */}
          <div className="bg-[#111] rounded-[52px] p-2.5 shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
            {/* Inner chrome ring */}
            <div className="bg-[#1c1c1c] rounded-[44px] overflow-hidden">
              {/* Status bar */}
              <div className="bg-black px-6 py-2 flex items-center justify-between">
                <span className="text-white text-xs font-semibold">9:41</span>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3" viewBox="0 0 18 12" fill="white" aria-hidden="true">
                    <rect x="0" y="6" width="3" height="6" rx="0.5"/>
                    <rect x="5" y="4" width="3" height="8" rx="0.5"/>
                    <rect x="10" y="2" width="3" height="10" rx="0.5"/>
                    <rect x="15" y="0" width="3" height="12" rx="0.5"/>
                  </svg>
                  <svg className="w-3.5 h-3" viewBox="0 0 20 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M1 4.5C5 0.5 15 0.5 19 4.5"/>
                    <path d="M3.5 7.5C6.5 4.5 13.5 4.5 16.5 7.5"/>
                    <path d="M6.5 10.5C8 9 12 9 13.5 10.5"/>
                    <circle cx="10" cy="13" r="1" fill="white" stroke="none"/>
                  </svg>
                  <div className="flex items-center gap-0.5">
                    <div className="w-5 h-2.5 rounded-[2px] border border-white/80 relative">
                      <div className="absolute inset-[1px] right-[1px] w-[80%] bg-white rounded-[1px]"/>
                    </div>
                    <div className="w-0.5 h-1.5 bg-white/50 rounded-r-[1px]"/>
                  </div>
                </div>
              </div>

              {/* Dynamic island */}
              <div className="bg-black flex justify-center pb-2">
                <div className="w-28 h-6 bg-black rounded-full border border-[#2a2a2a]"/>
              </div>

              {/* App screen */}
              <div className="h-[780px] overflow-y-auto overflow-x-hidden bg-white">
                {screen}
              </div>

              {/* Home indicator */}
              <div className="bg-black px-4 pt-2 pb-3 flex justify-center">
                <div className="w-28 h-1 bg-white/30 rounded-full"/>
              </div>
            </div>
          </div>

          {/* Side buttons — decorative */}
          <div className="absolute left-[-3px] top-24 w-[3px] h-8 bg-[#333] rounded-l-sm"/>
          <div className="absolute left-[-3px] top-36 w-[3px] h-12 bg-[#333] rounded-l-sm"/>
          <div className="absolute left-[-3px] top-52 w-[3px] h-12 bg-[#333] rounded-l-sm"/>
          <div className="absolute right-[-3px] top-36 w-[3px] h-16 bg-[#333] rounded-r-sm"/>
        </div>
      </div>
    )
  }

  // Default: white card sits directly in AppShell's bg-soft content area
  return <>{screen}</>
}
