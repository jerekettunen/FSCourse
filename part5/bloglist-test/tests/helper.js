const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const addBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.getByTestId('title-input').fill(title)
  await page.getByTestId('author-input').fill(author)
  await page.getByTestId('url-input').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${title} ${author}`).waitFor()
}

const addLike = async (page, likesToAdd) => {
  for (let i = 0; i < likesToAdd; i++) {
    await page.getByRole('button', { name: 'like' }).click()
    await page.getByText(`${i + 1} likes`).waitFor()
  }
  
}

export { loginWith, addBlog, addLike }