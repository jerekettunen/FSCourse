import { useEffect } from "react"
import Notification from "./components/Notification"
import Anecdotes from "./components/Anecdotes"
import AnecdoteForm from "./components/AnecdoteForm"
import Filter from "./components/Filter"
import { useDispatch } from "react-redux"
import { initializeAnecdotes } from "./reducers/anecdoteReducer"

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecdotes())
    }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <Anecdotes />
      <AnecdoteForm />
    </div>
  )
}

export default App