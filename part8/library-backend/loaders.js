const DataLoader = require('dataloader')
const Book = require('./models/book')

const bookCntByAuthLoader = new DataLoader(async (authorIds) => {
  // Use MongoDB aggregation to count books for each author
  console.log('authorIds', authorIds)
  const bookCounts = await Book.aggregate([
    {
      $match: {
        author: { $in: authorIds }, // Match books by author IDs as strings
      },
    },
    {
      $group: {
        _id: '$author', // Group by author ID
        count: { $sum: 1 }, // Count the number of books for each author
      },
    },
  ])
  console.log('bookCounts', bookCounts)
  // Create a map of authorId -> book count
  const bookCountMap = bookCounts.reduce((acc, { _id, count }) => {
    acc[_id] = count
    return acc
  }, {})
  console.log('bookCountMap', bookCountMap)

  // Return book counts in the same order as the input author IDs
  return authorIds.map((authorId) => bookCountMap[authorId.toString()] || 0)
})

module.exports = {
  bookCntByAuthLoader,
}
