import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

// eslint-disable-next-line react/prop-types
const Books = ({ show }) => {
  const { loading, data } = useQuery(ALL_BOOKS)
  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  const books = data.allBooks
  if (!books || books.length === 0) {
    return <div>no books found</div>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
