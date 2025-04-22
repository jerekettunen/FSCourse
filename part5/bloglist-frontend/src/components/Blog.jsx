import { useState} from 'react'

const Blog = ({ blog, updateLike, removeBlog }) => {
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
    {blog.title} {blog.author} {' '}
    <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
    <div style={{ display: visible ? '' : 'none' }}>
      <p>{blog.url}</p>
      <p>{blog.likes} {'likes '}
        <button onClick={addLike}>Like</button>
      </p>
      <p>added by {blog.user.name}</p>
      <button onClick={deleteBlog}>delete</button>
    </div>
  </div>
)}

export default Blog