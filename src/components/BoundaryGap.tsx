type BoundaryGapProps = {
  from: 'ink' | 'paper'
  to: 'ink' | 'paper'
}

/**
 * An empty band between two sections of opposite mode. The page background
 * shows through here and interpolates as it crosses the viewport, so the join
 * reads as a transition rather than a cut. It carries no text, so the crossfade
 * can never put copy over a shifting background.
 */
export function BoundaryGap({ from, to }: BoundaryGapProps) {
  return (
    <div
      aria-hidden="true"
      data-boundary=""
      data-from={from}
      data-to={to}
      className="h-[6vh] w-full"
    />
  )
}
