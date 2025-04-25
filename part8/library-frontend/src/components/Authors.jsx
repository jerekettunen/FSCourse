import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

// eslint-disable-next-line react/prop-types
const Authors = ({ show }) => {
  const { loading, data } = useQuery(ALL_AUTHORS)

  if (!show) {
    return null
  }
  if (loading) {
    return <div>loading...</div>
  }

  const authors = data.allAuthors
  if (!authors || authors.length === 0) {
    return <div>no authors found</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
