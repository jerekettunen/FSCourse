import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
  const id = useParams().id
  const blogs = useSelector((state) => state.blogs)
  console.log('blogs', blogs)
  const userBlogs = blogs.filter((blog) => blog.user.id === id)

  return (
    <div>
      <h2>User</h2>
      <p>added blogs</p>
      <ul>
        {userBlogs.map((blog) => (
          <li key={blog.id}>
            {blog.title} {blog.author}
          </li>
        ))}
      </ul>
    </div>
  )
}
export default User
