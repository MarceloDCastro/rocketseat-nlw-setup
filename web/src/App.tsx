import './styles/global.css'

import { Habit } from './components/Habit'

function App() {
  return (
    <div>
      <Habit completed={2} />
      <Habit completed={1} />
      <Habit />
      <Habit />
    </div>
  )
}

export default App
