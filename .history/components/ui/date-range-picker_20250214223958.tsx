"use client"

import * as React from "react"
import { addDays, format, addMonths, subMonths, isSameMonth, isSameDay } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerWithRangeProps {
  className?: string
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  // Use selected date start if available, else default to today.
  const [month, setMonth] = React.useState<Date>(date?.from || new Date())
  const [isOpen, setIsOpen] = React.useState(false)

  const presets = [
    {
      name: "Today",
      dates: { from: new Date(), to: new Date() },
    },
    {
      name: "Yesterday",
      dates: { from: addDays(new Date(), -1), to: addDays(new Date(), -1) },
    },
    {
      name: "Last 7 days",
      dates: { from: addDays(new Date(), -6), to: new Date() },
    },
    {
      name: "Last 30 days",
      dates: { from: addDays(new Date(), -29), to: new Date() },
    },
    {
      name: "This month",
      dates: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
  ]

  // Formats the selected date range for display.
  const formatDisplayDate = (date: DateRange | undefined) => {
    if (!date?.from) return "Select date range"
    if (!date.to) return format(date.from, "PPP")
    if (isSameDay(date.from, date.to)) return format(date.from, "PPP")
    if (isSameMonth(date.from, date.to))
      return `${format(date.from, "MMM d")} - ${format(date.to, "d, yyyy")}`
    return `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}`
  }

  // Update calendar view when date selection changes.
  React.useEffect(() => {
    if (date?.from) {
      setMonth(date.from)
    }
  }, [date])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal hover:bg-accent hover:text-accent-foreground",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplayDate(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="space-y-4 p-4">
            {/* Month and Year Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setMonth(subMonths(month, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Month Selector */}
              <Select
                value={month.getMonth().toString()}
                onValueChange={(value) => {
                  setMonth(new Date(month.getFullYear(), parseInt(value), month.getDate()))
                }}
              >
                <SelectTrigger className="h-7 w-[120px]">
                  <SelectValue>{format(month, "MMMM")}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {format(new Date(month.getFullYear(), i), "MMMM")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Selector */}
              <Select
                value={month.getFullYear().toString()}
                onValueChange={(value) => {
                  setMonth(new Date(parseInt(value), month.getMonth(), month.getDate()))
                }}
              >
                <SelectTrigger className="h-7 w-[80px]">
                  <SelectValue>{format(month, "yyyy")}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 21 }, (_, i) => {
                    const year = new Date().getFullYear() - 10 + i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setMonth(addMonths(month, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => {
                const isActive =
                  date?.from &&
                  date.to &&
                  isSameDay(date.from, preset.dates.from) &&
                  isSameDay(date.to, preset.dates.to)
                return (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    className={cn("text-xs", isActive && "bg-accent text-accent-foreground")}
                    onClick={() => {
                      setDate(preset.dates)
                      setIsOpen(false)
                    }}
                  >
                    {preset.name}
                  </Button>
                )
              })}
              {/* Clear Selection Button */}
              {date && date.from && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-red-500"
                  onClick={() => {
                    setDate(undefined)
                    setIsOpen(false)
                  }}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Calendar Component (Controlled with the "month" prop) */}
            <div className="rounded-md border">
              <Calendar
                mode="range"
                month={month}
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  if (newDate?.from && newDate?.to) {
                    setIsOpen(false)
                  }
                }}
                numberOfMonths={2}
                className="p-0"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
