import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'
import { createTheme } from '@mui/material/styles'

const NavBar = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'pink',
              textDecoration: 'none',
            }}
          >
            BLOGSAPP
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              sx={{ my: 2, color: 'white', display: 'block' }}
              component={Link}
              to={'/'}
            >
              Blogs
            </Button>
            <Button
              sx={{ my: 2, color: 'white', display: 'block' }}
              component={Link}
              to={'/users'}
            >
              Users
            </Button>

            {user ? (
              <p>
                {user.name} logged in
                <button onClick={() => dispatch(logoutUser())}>logout</button>
              </p>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default NavBar
