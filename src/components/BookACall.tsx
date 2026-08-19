import { ArrowRight } from 'lucide-react'

const CALENDLY_URL = 'https://calendly.com/abdullahabouselmi/30min'

type BookACallProps = {
  className?: string
  /** 'bone' sits on dark sections, 'ink' sits on light ones. */
  variant?: 'bone' | 'ink'
}

/** Shared pill CTA. Used in the About section and again to close the page. */
export function BookACall({ className, variant = 'bone' }: BookACallProps) {
  const pill =
    variant === 'ink' ? 'bg-ink text-bone' : 'bg-bone text-ink'
  const circle =
    variant === 'ink' ? 'bg-bone text-ink' : 'bg-ink text-bone'

  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-medium transition-all hover:gap-3 sm:text-base ${pill} ${className ?? ''}`}
    >
      {/* TODO: copy */}
      Book a call
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-110 sm:h-10 sm:w-10 ${circle}`}
      >
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </span>
    </a>
  )
}
