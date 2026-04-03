import { Signal, Wifi, BatteryMedium } from 'lucide-react'

/**
 * PhoneFrame — clean floating screen look.
 *
 * Outer wrapper is h-screen overflow-hidden — the desktop gray background
 * fills exactly the viewport, never scrolls.
 *
 * Screen container is h-[calc(100vh-32px)] capped at max-h-[844px] so it
 * always fits any viewport height without outer overflow.
 *
 * Status bar (50px) and home indicator (30px) are plain shrink-0 flex items
 * at the top/bottom of the flex column — no sticky needed since they live
 * outside the scroll container. The middle content area is flex-1
 * overflow-y-auto so it fills all remaining height and scrolls internally.
 */
export default function PhoneFrame({ children }) {
  return (
    /* ── Desk surface — fills viewport exactly, never scrolls ────────── */
    <div className="h-screen overflow-hidden bg-[#E8E8E8] flex items-center justify-center">

      {/* ── Floating screen container ──────────────────────────────────── */}
      <div
        className="relative w-[390px] h-[calc(100vh-32px)] max-h-[844px] rounded-[36px] overflow-hidden bg-white flex flex-col"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        {/* ── Status bar — sits above the scroll area ───────────────────── */}
        <div className="h-[50px] shrink-0 z-50 flex items-center justify-between px-6">
          <span className="text-[#111827] text-sm font-semibold">9:41</span>
          <div className="flex items-center gap-[5px]">
            <Signal        className="w-[13px] h-[13px] text-[#111827]" strokeWidth={2.5} aria-hidden="true" />
            <Wifi          className="w-[13px] h-[13px] text-[#111827]" strokeWidth={2.5} aria-hidden="true" />
            <BatteryMedium className="w-[17px] h-[17px] text-[#111827]" strokeWidth={2}   aria-hidden="true" />
          </div>
        </div>

        {/* ── Scrollable content — flex-1 fills all remaining height ────── */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>

        {/* ── Home indicator — sits below the scroll area ───────────────── */}
        <div className="h-[30px] shrink-0 flex items-center justify-center">
          <div className="w-[134px] h-[4px] rounded-full bg-black/15" />
        </div>
      </div>
    </div>
  )
}
