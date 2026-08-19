/**
 * Static stand-in for the 3D can: the Suspense fallback while the scene chunk
 * loads, and the permanent render under reduced motion or without WebGL.
 * Drawn at the RESULT state, amber band included.
 */
export function CanFallback({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 300" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="can-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9bfae" />
          <stop offset="38%" stopColor="#EFE4D1" />
          <stop offset="72%" stopColor="#ded3c0" />
          <stop offset="100%" stopColor="#b3a897" />
        </linearGradient>
        <clipPath id="can-clip">
          <path d="M42 34 H78 C82 34 86 38 86 46 V250 C86 258 82 262 78 262 H42 C38 262 34 258 34 250 V46 C34 38 38 34 42 34 Z" />
        </clipPath>
      </defs>

      <ellipse cx="60" cy="270" rx="34" ry="6" fill="#000" opacity="0.35" />
      <path
        d="M42 34 H78 C82 34 86 38 86 46 V250 C86 258 82 262 78 262 H42 C38 262 34 258 34 250 V46 C34 38 38 34 42 34 Z"
        fill="url(#can-body)"
      />
      <ellipse cx="60" cy="36" rx="24" ry="6" fill="#d8cdba" />
      <ellipse cx="60" cy="35" rx="20" ry="4.5" fill="#e7dcc9" />
      {/* The amber band the can carries from stage 05 onward. */}
      <rect x="34" y="132" width="52" height="34" fill="#C98B4B" clipPath="url(#can-clip)" />
    </svg>
  )
}
