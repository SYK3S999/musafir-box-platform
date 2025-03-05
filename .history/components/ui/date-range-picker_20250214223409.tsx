"use client"

import * as React from "react"
import { format, addMonths, subMonths, addYears, subYears } from "date-fns"
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
  const [numberOfMonths, setNumberOfMonths] = React.useState(2)

  // Generate years for the dropdown (10 years before and after current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  // Generate months for the dropdown
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const handlePreviousMonth = () => {
    setMonth(subMonths(month, 1))
  }

  const handleNextMonth = () => {
    setMonth(addMonths(month, 1))
  }

  const handlePreviousYear = () => {
    setMonth(subYears(month, 1))
  }

  const handleNextYear = () => {
    setMonth(addYears(month, 1))
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
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousYear}
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-2" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Select
                value={month.getFullYear().toString()}
                onValueChange={(value) =>
                  setMonth(new Date(parseInt(value), month.getMonth()))
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue>{month.getFullYear()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={month.getMonth().toString()}
                onValueChange={(value) =>
                  setMonth(new Date(month.getFullYear(), parseInt(value)))
                }
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue>
                    {months[month.getMonth()]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextYear}
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-2" />
              </Button>
            </div>
            
            <div className="flex items-center justify-end mt-2">
              <Select
                value={numberOfMonths.toString()}
                onValueChange={(value) => setNumberOfMonths(parseInt(value))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue>Show {numberOfMonths} months</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      Show {num} months
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Calendar
            initialFocus
            mode="range"
            defaultMonth={month}
            selected={date}
            onSelect={setDate}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}