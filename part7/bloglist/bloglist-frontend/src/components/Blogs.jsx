import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { updateLike, removeBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

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
    <div style={blogStyle} className="blog">
      <span title="blogTitle">
        {blog.title} {blog.author}
      </span>
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      <div style={{ display: visible ? '' : 'none' }} data-testid="details">
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

const Blogs = () => {
  const blogs = [...useSelector((state) => state.blogs)]
  const user = useSelector((state) => state.user)

  return (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} user={user} />
        ))}
    </div>
  )
}

export default Blogs
