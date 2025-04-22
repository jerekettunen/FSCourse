import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { describe, expect, test } from 'vitest'



describe('Testing basic functionality of blog component with one blog', () => {
  const blog = {
    title: 'Test Title',
    author: 'Tester McTestface',
    likes: 5,
    url: 'http://testurl.com',
    user: {
      name: 'Test User',
      id: '12345'
    }
  }

  test ('renders title and author but not others', () => {
    render(<Blog blog={blog} />)

    const element = screen.getByText('Test Title Tester McTestface')
    const hiddenElement = screen.getByTestId('details')

    expect(hiddenElement).toHaveStyle('display: none')
    expect(element).toBeDefined()

  })

  test ('renders url and likes when button is clicked', async () => {

    const mockHandler = vi.fn()

    render(<Blog blog={blog} updateLike={mockHandler} removeBlog={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = screen.getByTestId('details')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('http://testurl.com')
    expect(div).toHaveTextContent('5 likes')
  })

  test ('clicking the like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} updateLike={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByTestId('likeButton')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})