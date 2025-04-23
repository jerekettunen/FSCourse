const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, addBlog } = require('./helper')
const { get } = require('http')
const { addLike } = require('./HELPER.JS')

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
    await request.post('/api/users', {
      data: {
        username: 'VanHell',
        name: 'Van Helsinki',
        password: 'drakula'
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
          const otherRedBlogElement = await redBlogElement.locator('..')
          await otherRedBlogElement.getByRole('button', { name: 'view' }).click()
          await otherRedBlogElement.getByTestId('likeButton').click()

          await expect(otherRedBlogElement.getByText('1 likes')).toBeVisible()
        })

        test('it can be deleted by the user who created it', async ({ page }) => {
          page.on('dialog', dialog => dialog.accept())
          const redBlogElement = await page.getByText('The little red colored pool Not so wRight brothers')
          const otherRedBlogElement = await redBlogElement.locator('..')
          await otherRedBlogElement.getByRole('button', { name: 'view' }).click()
          await otherRedBlogElement.getByRole('button', { name: 'delete' }).click()
          await page.getByText('blog deleted').waitFor()

          await expect(otherRedBlogElement).toHaveCount(0)
          await expect(page.getByText('One paaaanchhhh Saitama')).toBeVisible()
          await expect(page.getByText('test title test author')).toHaveCount(1)
        })

        test('only the creator of the blog can see the delete button', async ({ page }) => {
          await page.getByText('logout').click()
          await page.getByText('login to application').waitFor()
          await loginWith(page, 'VanHell', 'drakula')
          await page.getByText('Van Helsinki logged in').waitFor()
          const redBlogElement = await page.getByText('The little red colored pool Not so wRight brothers')
          const otherRedBlogElement = await redBlogElement.locator('..')
          await otherRedBlogElement.getByRole('button', { name: 'view' }).click()
          await expect(otherRedBlogElement.getByRole('button', { name: 'delete' })).toHaveCount(0)
        })

        test('blogs are ordered by likes', async ({ page }) => {
          const redBlogElement = await page.getByText('The little red colored pool Not so wRight brothers')
          const otherRedBlogElement = await redBlogElement.locator('..')
          const onePunchElement = await page.getByText('One paaaanchhhh Saitama')
          const otherOnePunchElement = await onePunchElement.locator('..')
          const testElement = await page.getByText('test title test author')
          const otherTestElement = await testElement.locator('..')

          await otherRedBlogElement.getByRole('button', { name: 'view' }).click()
          await addLike(otherRedBlogElement, 1)

          await otherOnePunchElement.getByRole('button', { name: 'view' }).click()
          await addLike(otherOnePunchElement, 3)

          await otherTestElement.getByRole('button', { name: 'view' }).click()
          await addLike(otherTestElement, 2)

          const blogs = await page.locator('.blog')
          const blogTitles = await blogs.getByTitle('blogTitle')

          const titles = await blogTitles.allTextContents()

          await expect(titles).toEqual([
            'One paaaanchhhh Saitama',
            'test title test author',
            'The little red colored pool Not so wRight brothers'
          ])
        })
      })
    })
  })
})
