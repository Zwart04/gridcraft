import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be rendered within Tabs.Root')
  return ctx
}

interface TabsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

function Root({ className, defaultValue, value, onValueChange, children, ...props }: TabsRootProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '')
  const currentValue = value ?? internalValue
  const handleChange = (v: string) => { onValueChange?.(v); setInternalValue(v) }
  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
      <div className={cn('space-y-2', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function List({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={cn('inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground', className)} {...props} />
}

interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

function Trigger({ className, value, disabled, ...props }: TabTriggerProps) {
  const { value: selected, onValueChange } = useTabs()
  return (
    <button
      role="tab"
      aria-selected={selected === value}
      data-state={selected === value ? 'active' : 'inactive'}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm', className)}
      {...props}
    />
  )
}

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  hidden?: boolean
}

function Content({ className, value, hidden, children, ...props }: ContentProps) {
  const { value: selected } = useTabs()
  const isSelected = selected === value
  return (
    <div
      role="tabpanel"
      hidden={hidden !== undefined ? hidden : !isSelected}
      data-state={isSelected ? 'active' : 'inactive'}
      className={cn('mt-2 h-auto overflow-auto animate-in fade-in zoom-in-95', !isSelected && 'hidden', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const Tabs = { Root, List, Trigger, Content }
