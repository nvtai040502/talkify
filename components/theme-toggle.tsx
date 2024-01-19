'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { IconMoon, IconSun } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export function ThemeToggle({side = "right"}: {side?: "right" | "left" | "top" | "bottom"}) {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = React.useTransition()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              startTransition(() => {
                setTheme(theme === 'light' ? 'dark' : 'light')
              })
            }}
          >
            
            {!theme ? null : theme === 'dark' ? (
              <IconMoon className="transition-all" />
            ) : (
              <IconSun className="transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p>Theme Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    
    
  )
}
