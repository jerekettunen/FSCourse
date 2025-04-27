import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import RecommendedBooks from './components/RecommendedBooks'
import { useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqueByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqueByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const bookAdded = data.data.bookAdded
      const message = `A new book ${bookAdded.title} added`
      window.alert(message)
      updateCache(
        client.cache,
        { query: ALL_BOOKS, variables: { genre: null } },
        bookAdded
      )
      data.data.bookAdded.genres.forEach((genre) => {
        const cacheData = client.cache.readQuery({
          query: ALL_BOOKS,
          variables: { genre },
        })
        if (cacheData) {
          updateCache(
            client.cache,
            { query: ALL_BOOKS, variables: { genre } },
            bookAdded
          )
        }
      })
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm setToken={setToken} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <RecommendedBooks show={page === 'recommended'} />
    </div>
  )
}

export default App
