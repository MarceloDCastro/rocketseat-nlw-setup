import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"

type SummaryProps = {
    id: string;
    date: string;
    amount: number;
    completed: number;
}[]

const summaryDates = generateDatesFromYearBeginning()

const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

const weekDays=['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export function SummaryTable() {
    const [summary, setSummary] = useState<SummaryProps>([])

    function getSummary() {
        api.get('summary').then(({data}) => setSummary(data))
    }

    useEffect(getSummary, [])

    return (
        <div className='w-full flex'>
            <div className='grid grid-rows-7 grid-flow-row gap-3'>
                {weekDays.map((weekDay, index) => (
                    <div key={`${weekDay}-${index}`} className='text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center'>
                        {weekDay}
                    </div>
                ))}
            </div>

            <div className='grid grid-rows-7 grid-flow-col gap-3'>
                {summaryDates.map((date) => {
                    const dayInSummary = summary.find(day => dayjs(date).isSame(day.date, 'day'))

                    return (
                        <HabitDay
                            key={date.toString()}
                            date={date}
                            amount={dayInSummary?.amount}
                            completed={dayInSummary?.completed}
                        />
                    )
                })}
                {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => <div className="h-10 w-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />)}
            </div>
        </div>
    )
}