"use client"

import * as React from "react"
import { addDays, format, addMonths, subMonths, addYears, subYears, isSameMonth, isSameDay } from "date-fns"
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
  const [month, setMonth] = React.useState<Date>(new Date())
  const [isOpen, setIsOpen] = React.useState(false)

  const presets = [
    {
      name: "Today",
      dates: {
        from: new Date(),
        to: new Date(),
      },
    },
    {
      name: "Yesterday",
      dates: {
        from: addDays(new Date(), -1),
        to: addDays(new Date(), -1),
      },
    },
    {
      name: "Last 7 days",
      dates: {
        from: addDays(new Date(), -6),
        to: new Date(),
      },
    },
    {
      name: "Last 30 days",
      dates: {
        from: addDays(new Date(), -29),
        to: new Date(),
      },
    },
    {
      name: "This month",
      dates: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
  ]

  const formatDisplayDate = (date: DateRange | undefined) => {
    if (!date?.from) return "Select date range"
    if (!date.to) return format(date.from, "PPP")
    if (isSameDay(date.from, date.to)) return format(date.from, "PPP")
    if (isSameMonth(date.from, date.to)) 
      return `${format(date.from, "MMM d")} - ${format(date.to, "d, yyyy")}`
    return `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}`
  }

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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setMonth(subMonths(month, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select
                value={month.getMonth().toString()}
                onValueChange={(value) => {
                  setMonth(new Date(month.getFullYear(), parseInt(value)))
                }}
              >
                <SelectTrigger className="h-7 w-[140px]">
                  <SelectValue>
                    {format(month, "MMMM yyyy")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {format(new Date(month.getFullYear(), i), "MMMM yyyy")}
                    </SelectItem>
                  ))}
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
            <div className="flex gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs",
                    date?.from &&
                      date.to &&
                      isSameDay(date.from, preset.dates.from) &&
                      isSameDay(date.to, preset.dates.to) &&
                      "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    setDate(preset.dates)
                    setIsOpen(false)
                  }}
                >
                  {preset.name}
                </Button>
              ))}
            </div>
            <div className="rounded-md border">
              <Calendar
                mode="range"
                defaultMonth={month}
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