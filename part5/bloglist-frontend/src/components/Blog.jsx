import Togglable from "./Togglable"

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  return(
  <div style = {blogStyle} className='blog'>
    {blog.title} {blog.author}
    <Togglable buttonOpenLabel='view' buttonCloseLabel='hide'>
      <div>
        {blog.url}
      </div>
      <div>
        likes {blog.likes + "  "}  
        <button className='like-button'>Like</button>
      </div>
      <div>
        {blog.user.name}
      </div>
    </Togglable>
  </div>  
)}

export default Blog