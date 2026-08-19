import { ArrowDown } from 'lucide-react'

type ScrollDownButtonProps = {
  targetId: string
}

/** Same pill construction as the CTA, but scrolls the page rather than leaving it. */
export function ScrollDownButton({ targetId }: ScrollDownButtonProps) {
  return (
    <a
      href={`#${targetId}`}
      className="group inline-flex items-center gap-2 rounded-full bg-bone py-1.5 pl-5 pr-1.5 text-sm font-medium text-ink transition-all hover:gap-3 sm:text-base"
    >
      {/* TODO: copy */}
      Scroll down
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
        <ArrowDown className="h-4 w-4 text-bone" strokeWidth={2} />
      </span>
    </a>
  )
}
