/** Section eyebrow: a solid accent square, then the label. */
export function Eyebrow({
  children,
  tone = 'dark',
  className,
}: {
  children: string
  /** 'dark' sections use amber, 'light' sections use amberDeep. */
  tone?: 'dark' | 'light'
  className?: string
}) {
  const colour = tone === 'light' ? 'text-amberDeep' : 'text-amber'
  const square = tone === 'light' ? 'bg-amberDeep' : 'bg-amber'
  return (
    <p className={`label flex items-center ${colour} ${className ?? ''}`}>
      <span aria-hidden="true" className={`mr-2 inline-block h-1.5 w-1.5 shrink-0 ${square}`} />
      {children}
    </p>
  )
}
