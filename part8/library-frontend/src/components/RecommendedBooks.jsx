import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

// eslint-disable-next-line react/prop-types
const RecommendedBooks = ({ show }) => {
  const { loading: meLoading, data: userData } = useQuery(ME)

  const { loading: booksLoading, data } = useQuery(ALL_BOOKS, {
    skip: meLoading || !userData?.me?.favoriteGenre,
    variables: { genre: userData?.me?.favoriteGenre },
  })

  const loading = meLoading || booksLoading

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
      <h2>Recommendations</h2>

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
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecommendedBooks
