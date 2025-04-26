import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GENRES } from '../queries'
import { useState } from 'react'

// eslint-disable-next-line react/prop-types
const Books = ({ show }) => {
  const [genre, setGenre] = useState('all genres')

  const { data: genresData } = useQuery(GENRES)
  const { loading, data } = useQuery(ALL_BOOKS, {
    refetchQueries: [{ query: ALL_BOOKS }],
    variables: { genre: genre === 'all genres' ? null : genre },
  })
  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  const genres = genresData.allBooks.map((g) => g.genres)
  const uniqueGenres = [...new Set(genres.flat())]

  const books = data.allBooks
  if (!books || books.length === 0) {
    return <div>no books found</div>
  }

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

export default Books
