import dayjs from "dayjs";
import { FastifyInstance } from "fastify"
import { z } from "zod";
import { prisma } from "./lib/prisma"

export async function appRoutes(app: FastifyInstance) {
    app.post('/habits', async (request) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number().min(0).max(6)
            )
        })

        const { title, weekDays } = createHabitBody.parse(request.body);

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map((weekDay) => ({ weekDay }))
                }
            }
        })
    })
    
    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: { weekDay }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(({ habitId }) => habitId) || []

        return { possibleHabits, completedHabits }
    })

    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid()
        })

        const { id } = toggleHabitParams.parse(request.params)

        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        if(!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                dayId_habitId: {
                    dayId: day.id,
                    habitId: id
                }
            }
        })

        if(dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        } else {
            await prisma.dayHabit.create({
                data: {
                    dayId: day.id,
                    habitId: id
                }
            })
        }
    })

    app.get('/summary', async () => {

        const summary = await prisma.$queryRaw`
            SELECT D.id, D.date, 
                (
                    SELECT cast(count(*) as float)
                    FROM dayHabits DH
                    WHERE DH.dayId = D.id
                ) as completed,
                (
                    SELECT cast(count(*) as float)
                    FROM habitWeekDays HWD
                    JOIN habits H
                        ON H.id = HWD.habitId
                    WHERE
                        HWD.weekDay = cast(strftime('%w', D.date/1000, 'unixepoch') as int)
                        AND H.created_at <= D.date
                ) as amount
            FROM days D

        `

        return summary
    })
}