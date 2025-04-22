import { useState} from 'react'

const Blog = ({ blog }) => {
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
  
  return(
  <div style = {blogStyle} className='blog'>
    {blog.title} {blog.author} {' '}
    <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
    <div style={{ display: visible ? '' : 'none' }}>
      <p>{blog.url}</p>
      <p>{blog.likes} {'likes '}
        <button>Like</button>
      </p>
      <p>added by {blog.user.name}</p>
      <button>remove</button>
    </div>
  </div>
)}

export default Blog