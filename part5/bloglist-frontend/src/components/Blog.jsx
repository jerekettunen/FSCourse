import { useState } from 'react'

const Blog = ({ blog, updateLike, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = (event) => {
    event.preventDefault()
    const newLikes = {
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1,
      author: blog.author,
      user: blog.user.id
    }
    updateLike(blog.id, newLikes, blog.user)
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog.id)
    }
  }

  return(
    <div style = {blogStyle} className='blog'>
      <span title='blogTitle'>{blog.title} {blog.author}</span>
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      <div
        style={{ display: visible ? '' : 'none' }}
        data-testid="details">
        <p>{blog.url}</p>
        <p>{blog.likes} {'likes '}
          <button
            data-testid='likeButton'
            onClick={addLike}>Like</button>
        </p>
        <p>added by {blog.user.name}</p>
        {(user.name === blog.user.name) && (
          <button onClick={deleteBlog}>delete</button>
        )}
      </div>
    </div>
  )}

export default Blog