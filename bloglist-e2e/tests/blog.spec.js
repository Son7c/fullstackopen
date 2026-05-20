const { test, expect, beforeEach, describe } = require('@playwright/test')
describe('Blog app', () => {
  beforeEach(async ({ page ,request}) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users',{
      data:{
        name:"Demo1",
        username:"son7c_142",
        password:"nnn"
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button',{name:'Login'}).click();
    await expect(page.getByText('Username')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('button',{name:'Login'}).click()
      await expect(page.getByText('Username')).toBeVisible()

      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('nnn');

      await page.getByRole('button',{name:"Submit"}).click()
      await expect(page.getByText('Demo1 Logged in', { exact: true })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button',{name:'Login'}).click()
      await expect(page.getByText('Username')).toBeVisible()

      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('WRONG_PASSWORD');

      await page.getByRole('button',{name:"Submit"}).click()
      await expect(page.getByText('Wrong Credentials')).toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page ,request}) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users',{
        data:{
          name:"Demo1",
          username:"son7c_142",
          password:"nnn"
        }
      })
    })

    test('a new blog can be created', async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByRole('button',{name:'Login'}).click()
      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('nnn');
      await page.getByRole('button',{name:"Submit"}).click()

      await page.getByRole('button',{name:'Create'}).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button',{name:'Create'}).click()
      await expect(page.getByText('playwright by son7c')).toBeVisible()
    })
    test('Blog can be liked',async({page})=>{
      await page.goto('http://localhost:5173')
      await page.getByRole('button',{name:'Login'}).click()
      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('nnn');
      await page.getByRole('button',{name:"Submit"}).click()

      await page.getByRole('button',{name:'Create'}).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button',{name:'Create'}).click()

      await page.getByRole('button',{name:'view'}).click()
      await page.getByRole('button',{name:'like'}).click()
      await expect(page.getByText('1')).toBeVisible();
    })

    test('Blog can be deleted',async({page})=>{
      await page.goto('http://localhost:5173')
      await page.getByRole('button',{name:'Login'}).click()
      await page.getByLabel('Username').fill('son7c_142');
      await page.getByLabel('Password').fill('nnn');
      await page.getByRole('button',{name:"Submit"}).click()

      await page.getByRole('button',{name:'Create'}).click()
      await page.getByLabel('title:').fill("playwright")
      await page.getByLabel('author:').fill('son7c')
      await page.getByLabel('url:').fill("www.google.com")
      await page.getByRole('button',{name:'Create'}).click()
      await page.getByRole('button',{name:'view'}).click()

      page.once('dialog', async (dialog) => {
        await dialog.accept();
      });

      await page.getByRole('button', { name: 'Delete' }).click();
      await expect(page.getByRole('button', { name: 'view' })).toBeHidden();
    })
  })
})