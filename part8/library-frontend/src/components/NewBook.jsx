import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, GENRES } from '../queries'

// eslint-disable-next-line react/prop-types
const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addNewBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      console.log('error', error)
    },
    update: (cache, response) => {
      cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre: null } },
        ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(response.data.addBook),
          }
        }
      )
      response.data.addBook.genres.forEach((genre) => {
        if (genre) {
          cache.updateQuery(
            { query: ALL_BOOKS, variables: { genre } },
            ({ allBooks }) => {
              return {
                allBooks: allBooks.concat(response.data.addBook),
              }
            }
          )
        }
      })
      cache.updateQuery({ query: GENRES }, ({ allBooks }) => {
        const genre = {
          __typename: 'Book',
          genres: response.data.addBook.genres,
        }
        return {
          allBooks: allBooks.concat(genre),
        }
      })
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const authorExists = allAuthors.some(
          (author) => author.name === response.data.addBook.author.name
        )
        if (!authorExists) {
          return {
            allAuthors: allAuthors.concat({
              __typename: 'Author',
              name: response.data.addBook.author.name,
              born: null,
              bookCount: 1,
            }),
          }
        }
        return {
          allAuthors: allAuthors.map((author) =>
            author.name === response.data.addBook.author.name
              ? { ...author, bookCount: author.bookCount + 1 }
              : author
          ),
        }
      })
    },
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')
    addNewBook({
      variables: {
        title,
        published: parseInt(published),
        author,
        genres,
      },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
