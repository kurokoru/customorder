"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  className,
  disabled = false
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(
    date ? format(date, "yyyy-MM-dd") : ""
  )
  const [displayValue, setDisplayValue] = React.useState(
    date ? format(date, "dd/MM/yyyy") : ""
  )

  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "yyyy-MM-dd"))
      setDisplayValue(format(date, "dd/MM/yyyy"))
    } else {
      setInputValue("")
      setDisplayValue("")
    }
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    // Try to parse the date
    if (value) {
      const parsedDate = new Date(value)
      if (!isNaN(parsedDate.getTime())) {
        setDisplayValue(format(parsedDate, "dd/MM/yyyy"))
        onDateChange?.(parsedDate)
      }
    } else {
      setDisplayValue("")
      onDateChange?.(undefined)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Input
          type="date"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className={cn("pr-10", className)}
          disabled={disabled}
        />
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
              disabled && "cursor-not-allowed opacity-50"
            )}
            disabled={disabled}
          >
            {/* <CalendarIcon className="h-4 w-4" /> */}
          </Button>
        </PopoverTrigger>
      </div>
      {/* <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-2">
          <div className="text-sm font-medium">Select Date</div>
          <Input
            type="date"
            value={inputValue}
            onChange={handleInputChange}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                const today = new Date()
                setInputValue(format(today, "yyyy-MM-dd"))
                setDisplayValue(format(today, "dd/MM/yyyy"))
                onDateChange?.(today)
              }}
              variant="outline"
              className="flex-1"
            >
              Today
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setInputValue("")
                setDisplayValue("")
                onDateChange?.(undefined)
              }}
              variant="outline"
              className="flex-1"
            >
              Clear
            </Button>
          </div>
          <Button
            size="sm"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Done
          </Button>
        </div>
      </PopoverContent> */}
    </Popover>
  )
}
