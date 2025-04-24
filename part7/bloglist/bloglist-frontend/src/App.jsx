import { useState, useEffect, useRef, useReducer } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useSetNotification } from './contexts/NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, userDispatch] = useReducer(userReducer, null)
  const setNotification = useSetNotification()
  const queryClient = useQueryClient()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  const blogs = result.data || []

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()
      notifyWith(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        false
      )
    },
    onError: (error) => {
      notifyWith('error adding blog', true)
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const updatedBlogs = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
      queryClient.setQueryData(['blogs'], updatedBlogs)
    },
    onError: (error) => {
      notifyWith('error updating blog', true)
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      notifyWith('blog deleted', false)
    },
    onError: (error) => {
      notifyWith('error deleting blog', true)
    },
  })

  const notifyWith = (message, isError) => {
    setNotification(message, isError, 5)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Logging in with', username + ' and ' + password)

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith('wrong username or password', true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    userDispatch({ type: 'LOGOUT' })
  }

  const addBlog = (blogObject) => {
    newBlogMutation.mutate(blogObject)
  }

  const updateLike = (id, blogObject) => {
    updateBlogMutation.mutate(id, blogObject)
  }

  const deleteBlog = (blogID) => {
    deleteBlogMutation.mutate(blogID)
  }

  const blogFormRef = useRef()

  return (
    <div>
      <Notification />
      {!user && (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      )}

      {user && (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable
            buttonOpenLabel="Create new blog"
            buttonCloseLabel="Cancel"
            ref={blogFormRef}
          >
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <br />
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateLike={updateLike}
                removeBlog={deleteBlog}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
