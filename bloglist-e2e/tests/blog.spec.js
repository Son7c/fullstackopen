const { test, expect, beforeEach, describe } = require('@playwright/test')
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: "Demo1",
        username: "son7c_142",
        password: "nnn"
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Username')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'Login' }).click()
      await expect(page.getByText('Username')).toBeVisible()

      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('nnn');

      await page.getByRole('button', { name: "Submit" }).click()
      await expect(page.getByText('Demo1 Logged in', { exact: true })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'Login' }).click()
      await expect(page.getByText('Username')).toBeVisible()

      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('WRONG_PASSWORD');

      await page.getByRole('button', { name: "Submit" }).click()
      await expect(page.getByText('Wrong Credentials')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {
      // await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: "Demo1",
          username: "son7c_142",
          password: "nnn"
        }
      })
    })

    test('a new blog can be created', async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'Login' }).click()
      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('nnn');
      await page.getByRole('button', { name: "Submit" }).click()

      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button', { name: 'Create' }).click()
      await expect(page.getByText('playwright by son7c')).toBeVisible()
    })
    test('Blog can be liked', async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'Login' }).click()
      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('nnn');
      await page.getByRole('button', { name: "Submit" }).click()

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
      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'Login' }).click()
      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('nnn');
      await page.getByRole('button', { name: "Submit" }).click()

      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async (dialog) => {
        await dialog.accept();
      });

      await page.getByRole('button', { name: 'Delete' }).click();
      await expect(page.getByRole('button', { name: 'view' })).toBeHidden();
    })

    test('Only creator can see the Delete button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: "Demo2",
          username: "son7c",
          password: "nnn"
        }
      })

      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'Login' }).click()
      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('nnn');
      await page.getByRole('button', { name: "Submit" }).click()

      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button', { name: 'Create' }).click()

      //Logout
      await page.getByRole('button', { name: "Log Out" }).click()

      //Log in with different username and pass
      await page.getByRole('button', { name: 'Login' }).click()
      await page.getByLabel('Username').fill('son7c');
      await page.getByLabel('Password').fill('nnn');
      await page.getByRole('button', { name: "Submit" }).click()

      //Create new Blog
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByLabel('title:').fill("Lambda")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button', { name: 'Create' }).click()

      const blogLocator = page.locator('.blog').filter({ hasText: 'playwright' });
      await blogLocator.getByRole('button', { name: 'view' }).click();
      await expect(page.getByRole('button', { name: 'Delete' })).toBeHidden()
      await blogLocator.getByRole('button',{name:'cancel'}).click()

      const blog2=page.locator('.blog').filter({hasText:'Lambda'});
      await blog2.getByRole('button', { name: 'view' }).click();

      await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
    })
  })
})