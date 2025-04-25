import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Users from './components/Users'
import User from './components/User'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import { Routes, Route, useMatch, Link, Navigate } from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)

  const blogsMatch = useMatch('/blogs/:id')
  const blog = blogs.find((blog) => blog.id === blogsMatch?.params.id)

  const padding = {
    padding: 5,
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {user ? (
          <em>
            {user.name} logged in
            <button onClick={() => dispatch(logoutUser())}>logout</button>
          </em>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
      </div>
      <Notification />
      {!user && <LoginForm />}

      {user && (
        <div>
          <h2>Blogs</h2>
          <Routes>
            <Route path="/users/:id" element={<User />} />
            <Route
              path="/users"
              element={user ? <Users /> : <Navigate replace to="/login" />}
            />
            <Route
              path="/blogs/:id"
              element={
                blog ? <Blog blog={blog} /> : <Navigate replace to="/" />
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
