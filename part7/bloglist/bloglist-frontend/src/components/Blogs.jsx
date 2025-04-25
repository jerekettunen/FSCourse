import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Blog = ({ blog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} className="blog">
      <span title="blogTitle">
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </span>
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
