type HabitProps = {
    completed?: number
    isDisabled?: boolean
}

export function HabitDay(props: HabitProps) {
    const { isDisabled } = props;
    return <div className={`h-10 w-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg ${isDisabled && 'opacity-40 cursor-not-allowed'}`}></div>
}