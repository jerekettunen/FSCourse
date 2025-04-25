import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateLike, removeBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import { Navigate, useParams } from 'react-router-dom'

const Blog = ({ blog }) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const addLike = (event) => {
    event.preventDefault()
    const newLikes = {
      ...blog,
      likes: blog.likes + 1,
    }
    dispatch(updateLike(blog.id, newLikes))
    dispatch(
      setNotificationWithTimeout(
        `Blog ${blog.title} by ${blog.author} liked`,
        5
      )
    )
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id))
      dispatch(
        setNotificationWithTimeout(
          `Blog ${blog.title} by ${blog.author} removed`,
          5
        )
      )
    }
  }

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <p>{blog.url}</p>
        <p>
          {blog.likes} {'likes '}
          <button data-testid="likeButton" onClick={addLike}>
            Like
          </button>
        </p>
        <p>added by {blog.user.name}</p>
        {user.name === blog.user.name && (
          <button onClick={deleteBlog}>delete</button>
        )}
      </div>
    </div>
  )
}
export default Blog
