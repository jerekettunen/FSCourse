import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

// eslint-disable-next-line react/prop-types
const Books = ({ show }) => {
  const [genre, setGenre] = useState('all genres')

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
  const uniqueGenres = [...new Set(books.flatMap((book) => book.genres))]

  const filteredBooks =
    genre === 'all genres'
      ? books
      : books.filter((book) => book.genres.includes(genre))

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <b>{genre}</b>
      </p>
      <div>
        {uniqueGenres.map((g) => (
          <button
            key={g}
            onClick={() => {
              setGenre(g)
            }}
          >
            {g}
          </button>
        ))}
        <button
          onClick={() => {
            setGenre('all genres')
          }}
        >
          all genres
        </button>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
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

export default Books
