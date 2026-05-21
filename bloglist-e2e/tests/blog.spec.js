const { test, expect, beforeEach, describe } = require('@playwright/test')

// Helper function to handle repetitive login UI flow
const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'Login' }).click()
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Submit' }).click()
}

describe('Blog app', () => {
  // Main setup: Reset DB and create base user before EVERY test
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { name: "Demo1", username: "son7c_142", password: "nnn" }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByText('Username')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'son7c_142', 'nnn')
      await expect(page.getByText('Demo1 Logged in', { exact: true })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'son7c_142', 'WRONG_PASSWORD')
      await expect(page.getByText('Wrong Credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'son7c_142', 'nnn')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('playwright by son7c')).toBeVisible()
    })

    test('Blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button', { name: 'Create' }).click()

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.locator('.likes')).toContainText('1')
    })

    test('Blog can be deleted', async ({ page }) => {
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async (dialog) => { await dialog.accept() })
      await page.getByRole('button', { name: 'Delete' }).click()
      await expect(page.getByRole('button', { name: 'view' })).toBeHidden()
    })

    test('Only creator can see the Delete button', async ({ page, request }) => {
      // Setup second user
      await request.post('http://localhost:3003/api/users', {
        data: { name: "Demo2", username: "son7c", password: "nnn" }
      })

      // Create blog as Demo1
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button', { name: 'Create' }).click()

      // Logout and Login as Demo2
      await page.getByRole('button', { name: "Log Out" }).click()
      await loginWith(page, 'son7c', 'nnn')

      // Create blog as Demo2
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('title:').fill("Lambda")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button', { name: 'Create' }).click()

      // Verify Demo2 cannot delete Demo1's blog
      const blog1 = page.locator('.blog').filter({ hasText: 'playwright' });
      await blog1.getByRole('button', { name: 'view' }).click();
      await expect(blog1.getByRole('button', { name: 'Delete' })).toBeHidden();
      await blog1.getByRole('button', { name: 'cancel' }).click()

      // Verify Demo2 CAN delete their own blog
      const blog2 = page.locator('.blog').filter({ hasText: 'Lambda' });
      await blog2.getByRole('button', { name: 'view' }).click();
      await expect(blog2.getByRole('button', { name: 'Delete' })).toBeVisible();
    })

    test('blogs are arranged in order of likes', async ({ page, request }) => {
      // Request a login token directly from your server backend endpoint
      const loginResponse = await request.post('http://localhost:3003/api/login', {
        data: {
          username: 'son7c_142',
          password: 'nnn'
        }
      })
      const loginData = await loginResponse.json()
      const token = loginData.token
      const blogsToSeed = [
        { title: 'Blog with 5 likes', author: 'son7c', url: 'www.test1.com', likes: 5 },
        { title: 'Blog with 15 likes', author: 'son7c', url: 'www.test2.com', likes: 15 },
        { title: 'Blog with 0 likes', author: 'son7c', url: 'www.test3.com', likes: 0 }
      ]

      for (const blog of blogsToSeed) {
        await request.post('http://localhost:3003/api/blogs', {
          data: blog,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }

      await page.goto('http://localhost:5173')

      const blogLocators = page.locator('.blog')
      await expect(blogLocators.nth(0)).toContainText('Blog with 15 likes')
      await expect(blogLocators.nth(1)).toContainText('Blog with 5 likes')
      await expect(blogLocators.nth(2)).toContainText('Blog with 0 likes')
    })
  })
})
