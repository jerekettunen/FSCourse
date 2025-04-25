import { initializeAllUsers } from '../reducers/usersReducer'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import User from './User'

const Users = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAllUsers())
  }, [dispatch])

  const users = useSelector((state) => state.users)
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
