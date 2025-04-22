const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, addBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'root',
        name: 'root',
        password: 'sekrid'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('login to application')
    await expect(locator).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      loginWith(page, 'root', 'sekrid')

      await expect(page.getByText('root logged in')).toBeVisible()
      await expect(page.getByText('login to application')).not.toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      loginWith(page, 'root', 'nope')

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'root', 'sekrid')
      })

      test('A blog can be created', async ({ page, request }) => {

        await page.getByRole('button', { name: 'Create new blog' }).click()
        await page.getByTestId('title-input').fill('test title')
        await page.getByTestId('author-input').fill('test author')
        await page.getByTestId('url-input').fill('test url')
        await page.getByRole('button', { name: 'create' }).click()

        
        await expect(page.getByText('test title test author')).toBeVisible()
      })

      describe('and a blog exists', () => {
        beforeEach(async ({ page }) => {
          await addBlog(page, 'test title', 'test author', 'test url')
          await addBlog(page, 'The little red colored pool', 'Not so wRight brothers', 'www.redpool.com')
          await addBlog(page, 'One paaaanchhhh', 'Saitama', 'www.onepunchman.com')
        })
        test('it can be liked', async ({ page }) => {

          const redBlogElement = await page.getByText('The little red colored pool Not so wRight brothers')
          await redBlogElement.getByRole('button', { name: 'view' }).click()
          await redBlogElement.getByTestId('likeButton').click()

          await expect(redBlogElement.getByText('1 likes')).toBeVisible()
        })
      })
    })
  })
})
