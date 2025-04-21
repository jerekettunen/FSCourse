const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authorBlogsCount = _.countBy(blogs, 'author')
  const mostBlogsAuthor = _.maxBy(Object.entries(authorBlogsCount), ([, count]) => count)
  return { author: mostBlogsAuthor[0], blogs: mostBlogsAuthor[1] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authorLikesCount = _.reduce(blogs, (result, blog) => {
    console.log(blog.author)
    result[blog.author] = (result[blog.author] || 0 ) + blog.likes
    return result
  }, {})
  const mostLikesAuthor = _.maxBy(Object.entries(authorLikesCount), ([, count]) => count)
  return { author: mostLikesAuthor[0], likes: mostLikesAuthor[1] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}