import { MaskReveal } from './MaskReveal'

type Props = {
  text: string
  className?: string
  order?: number
}

export function WordsPullUp({ text, className, order }: Props) {
  return (
    <MaskReveal as="span" className={`block ${className ?? ''}`} order={order}>
      {text}
    </MaskReveal>
  )
}
