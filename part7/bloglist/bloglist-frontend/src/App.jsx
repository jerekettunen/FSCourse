import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null })
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, isError) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Logging in with', username + ' and ' + password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      notifyWith('wrong username or password', true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat({ ...returnedBlog, user: user }))
        notifyWith(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, false)
      })
      .catch(error => {
        notifyWith('error adding blog', true)
      })
  }

  const updateLike = (id, blogObject, user) => {
    blogService
      .update(id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...returnedBlog, user: user }))
      })
      .catch(error => {
        notifyWith('error updating blog', true)
      })
  }

  const deleteBlog = (blogID) => {
    blogService
      .remove(blogID)
      .then(returnedBlog => {
        setBlogs(blogs.filter(blog => blog.id !== blogID))
        notifyWith('blog deleted', false)
      })
      .catch(error => {
        notifyWith('error updating blog', true)
      })
  }

  const blogFormRef = useRef()





  return (
    <div>
      <Notification notification={notification} />
      {!user && <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
      />
      }

      {user && <div>
        <h2>Blogs</h2>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        <Togglable buttonOpenLabel="Create new blog" buttonCloseLabel="Cancel" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <br />
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog} updateLike={updateLike} removeBlog={deleteBlog} user={user} />
          )}
      </div>
      }
    </div>
  )
}

export default App