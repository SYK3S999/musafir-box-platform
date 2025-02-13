"use client"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format, startOfMonth, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: {
  className?: string
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}) {
  const today = new Date()

  // Quick preset selection
  const selectPreset = (preset: "today" | "last7" | "thisMonth") => {
    if (preset === "today") setDate({ from: today, to: today })
    if (preset === "last7") setDate({ from: subDays(today, 6), to: today })
    if (preset === "thisMonth") setDate({ from: startOfMonth(today), to: today })
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            aria-label="Select date range"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex flex-col space-y-2">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={(day) => day > today} // Prevent selecting future dates
            />
            <div className="flex justify-between space-x-2">
              <Button variant="ghost" size="sm" onClick={() => selectPreset("today")}>
                Today
              </Button>
              <Button variant="ghost" size="sm" onClick={() => selectPreset("last7")}>
                Last 7 Days
              </Button>
              <Button variant="ghost" size="sm" onClick={() => selectPreset("thisMonth")}>
                This Month
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
