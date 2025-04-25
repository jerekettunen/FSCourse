import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    appendUser(state, action) {
      state.push(action.payload)
    },
    removeUser(state, action) {
      const id = action.payload.id
      return state.filter((user) => user.id !== id)
    },
  },
})
export const { setUsers, appendUser, removeUser } = usersSlice.actions
export default usersSlice.reducer

export const initializeAllUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}
