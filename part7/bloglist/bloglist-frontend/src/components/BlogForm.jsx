import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const BlogForm = () => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const addBlog = (event) => {
    event.preventDefault()

    dispatch(
      createNewBlog(
        {
          title: newTitle,
          author: newAuthor,
          url: newUrl,
        },
        { username: user.username, name: user.name }
      )
    )
    dispatch(
      setNotificationWithTimeout(
        `a new blog ${newTitle} by ${newAuthor} added`,
        5
      )
    )
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setNewTitle(target.value)}
            data-testid="title-input"
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setNewAuthor(target.value)}
            data-testid="author-input"
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={newUrl}
            name="Url"
            onChange={({ target }) => setNewUrl(target.value)}
            data-testid="url-input"
          />
        </div>
        <button type="submit" data-testid="create-button">
          create
        </button>
      </form>
    </div>
  )
}

export default BlogForm
