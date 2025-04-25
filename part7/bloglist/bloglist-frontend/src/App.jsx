import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Users from './components/Users'
import User from './components/User'
import NavBar from './components/NavBar'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import { Routes, Route, useMatch, Link, Navigate } from 'react-router-dom'
import styled from 'styled-components'

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

  const Page = styled.div`
    padding: 1em;
    background: rgba(255, 179, 250, 0.26);
  `

  return (
    <Page>
      <NavBar />
      <Notification />
      {!user && <LoginForm />}

      {user && (
        <div>
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
            <Route
              path="/login"
              element={!user ? <LoginForm /> : <Navigate replace to="/" />}
            />
          </Routes>
        </div>
      )}
    </Page>
  )
}

export default App
