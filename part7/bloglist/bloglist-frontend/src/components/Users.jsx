import { initializeAllUsers } from '../reducers/usersReducer'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link as MuiLink,
} from '@mui/material'

const Users = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAllUsers())
  }, [dispatch])

  const users = useSelector((state) => state.users)
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderBottom: '1px solid rgb(0, 0, 0)' }}>
                User
              </TableCell>
              <TableCell sx={{ borderBottom: '1px solid rgb(9, 9, 9)' }}>
                Blogs Created
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  backgroundColor:
                    index % 2 === 0 ? 'rgba(0, 0, 0, 0.04)' : 'inherit',
                  '&:not(:last-child) td': {
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  },
                }}
              >
                <TableCell>
                  <MuiLink
                    component={Link}
                    to={`/users/${user.id}`}
                    underline="hover"
                  >
                    {user.name}
                  </MuiLink>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
