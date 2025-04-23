import { useEffect } from "react"
import Notification from "./components/Notification"
import Anecdotes from "./components/Anecdotes"
import AnecdoteForm from "./components/AnecdoteForm"
import Filter from "./components/Filter"
import anecdoteService from "./services/anecdotes"
import { useDispatch } from "react-redux"
import { setAnecdotes } from "./reducers/anecdoteReducer"

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    anecdoteService
      .getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
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