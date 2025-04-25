import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateBlogInfo, removeBlog } from '../reducers/blogReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import styled from 'styled-components'

const Blog = ({ blog }) => {
  const Button = styled.button`
    background: lightblue;
    font-size: 1em;
    margin: 1em;
    padding: 0.25em 1em;
    border: 2px solid lightyellow;
    border-radius: 3px;
  `

  const [commentInput, setCommentInput] = React.useState('')

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const comments = blog.comments

  const addLike = (event) => {
    event.preventDefault()
    const newLikes = {
      ...blog,
      likes: blog.likes + 1,
    }
    dispatch(updateBlogInfo(blog.id, newLikes))
    dispatch(
      setNotificationWithTimeout(
        `Blog ${blog.title} by ${blog.author} liked`,
        5
      )
    )
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id))
      dispatch(
        setNotificationWithTimeout(
          `Blog ${blog.title} by ${blog.author} removed`,
          5
        )
      )
    }
  }

  const addComment = (event) => {
    event.preventDefault()
    if (commentInput) {
      const newComments = comments.concat(commentInput)
      const updatedBlog = { ...blog, comments: newComments }
      dispatch(updateBlogInfo(blog.id, updatedBlog))
      setCommentInput('')
    }
  }

  return (
    <div>
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <p>{blog.url}</p>
        <p>
          {blog.likes} {'likes '}
          <Button data-testid="likeButton" onClick={addLike}>
            Like
          </Button>
        </p>
        <p>added by {blog.user.name}</p>
        {user.name === blog.user.name && (
          <Button onClick={deleteBlog}>delete</Button>
        )}
        <h3>Comments</h3>
        <form onSubmit={addComment}>
          <input
            type="text"
            placeholder="Add a comment"
            name="comment"
            data-testid="commentInput"
            onChange={({ target }) => setCommentInput(target.value)}
          />
          <Button type="submit" data-testid="commentButton">
            Add Comment
          </Button>
        </form>
        {comments.length === 0 || !comments ? (
          <p>No comments yet</p>
        ) : (
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
export default Blog
