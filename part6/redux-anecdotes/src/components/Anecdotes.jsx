import { useDispatch, useSelector } from 'react-redux'
import { updateVote } from '../reducers/anecdoteReducer'
import PropTypes from 'prop-types'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </div>
  )
}

const Anecdotes = () => {

  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === '') {
      return anecdotes
    }
    return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const handleVote = (anecdote) => {
    dispatch(updateVote(anecdote))
    dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 5))

  }

  return (
    <div>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => handleVote(anecdote)} // Pass the function to handleVote
        />
      )}
    </div>
  )
}


Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    content: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  handleVote: PropTypes.func.isRequired
}

export default Anecdotes