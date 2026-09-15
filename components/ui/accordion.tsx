import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

interface AccordionContextValue {
  value: string[]
  onValueChange: (value: string[]) => void
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

function useAccordion() {
  const ctx = React.useContext(AccordionContext)
  if (!ctx) throw new Error('Accordion components must be rendered within Accordion.Root')
  return ctx
}

interface AccordionRootProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
}

function Root({ className, defaultValue = [], value: controlledValue, onValueChange, children, ...props }: AccordionRootProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)
  const value = controlledValue ?? internalValue
  const handleValueChange = (val: string[]) => { onValueChange?.(val); setInternalValue(val) }
  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn('space-y-1.5', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

function Item({ className, value, disabled, children, ...props }: ItemProps) {
  const { value: selected, onValueChange } = useAccordion()
  const isSelected = selected.includes(value)
  const toggle = () => {
    if (disabled) return
    onValueChange(isSelected ? selected.filter(v => v !== value) : [...selected, value])
  }
  return (
    <div role="region" data-state={isSelected ? 'open' : 'closed'} className={cn('border-b', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isSelected, onValueChange: toggle, disabled })
        }
        return child
      })}
    </div>
  )
}

interface TriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function Trigger({ className, children, ...props }: TriggerProps) {
  const { isSelected, onValueChange, disabled } = useAccordion() as any
  return (
    <button
      type="button"
      aria-expanded={isSelected}
      disabled={disabled}
      onClick={onValueChange}
      className={cn('flex h-10 w-full items-center justify-between py-4 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-muted/50', className)}
      {...props}
    >
      {children}
      {isSelected ? <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform duration-200" /> : <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />}
    </button>
  )
}

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function Content({ className, children, ...props }: ContentProps) {
  const { isSelected } = useAccordion() as any
  return (
    <div data-state={isSelected ? 'open' : 'closed'} className={cn('overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down', className)} {...props}>
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
}

export const Accordion = { Root, Item, Trigger, Content }
