import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const id = action.payload.id
      return state.map((blog) => (blog.id !== id ? blog : action.payload))
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeOneBlog(state, action) {
      const id = action.payload.id
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export default blogSlice.reducer
export const { appendBlog, updateBlog, setBlogs, removeOneBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}
export const createNewBlog = (newObject, user) => {
  return async (dispatch) => {
    const result = await blogService.create(newObject)
    const newBlog = {
      ...result,
      user: user,
    }
    dispatch(appendBlog(newBlog))
  }
}
export const updateLike = (id, newObject) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(id, newObject)
    dispatch(updateBlog({ ...updatedBlog, user: newObject.user }))
  }
}
export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(removeOneBlog({ id }))
  }
}
