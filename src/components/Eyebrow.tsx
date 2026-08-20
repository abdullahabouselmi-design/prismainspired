/** Section eyebrow: an uppercase tracked label, in the section's accent. */
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
  return <p className={`label ${colour} ${className ?? ''}`}>{children}</p>
}
