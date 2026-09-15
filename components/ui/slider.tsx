import * as React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
  value?: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = 0, min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100
    return (
      <div ref={ref} className={cn('relative flex w-full touch-none select-none items-center', className)}>
        <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
          <div className="h-full w-1/2 max-w-full bg-primary" style={{ width: `${percentage}%` }}></div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onValueChange?.(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }