import { useQueryClient, useMutation } from "@tanstack/react-query"
import { createAnecdote } from '../requests'
import { useContext } from "react"
import NotificationContext from "../NotificationContext"


const AnecdoteForm = () => {

  const queryClient = useQueryClient()

  const [notification, setNotification ] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      setNotification(`anecdote creation failed: ${error.response.data.error}`, 5)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    setNotification(`you created '${content}'`, 5)

}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
