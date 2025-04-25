import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blogs from './Blogs'
import { useRef } from 'react'

const Home = () => {
  const blogFormRef = useRef()

  return (
    <div>
      <Togglable
        buttonOpenLabel="Create new blog"
        buttonCloseLabel="Cancel"
        ref={blogFormRef}
      >
        <BlogForm />
      </Togglable>
      <br />
      <Blogs />
    </div>
  )
}

export default Home
