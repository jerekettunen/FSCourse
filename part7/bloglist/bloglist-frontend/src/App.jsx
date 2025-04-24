import { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blogs'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useSelector, useDispatch } from 'react-redux'
import { setNotificationWithTimeout } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const user = useSelector((state) => state.user)

  const blogFormRef = useRef()

  return (
    <div>
      <Notification />
      {!user && <LoginForm />}

      {user && (
        <div>
          <h2>Blogs</h2>
          <p>
            {user.name} logged in{' '}
            <button onClick={() => dispatch(logoutUser())}>logout</button>
          </p>
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
      )}
    </div>
  )
}

export default App
