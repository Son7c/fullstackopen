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
      const inputs= await page.getByRole('textbox').all();
      await inputs[0].fill('son7c_142')
      await inputs[1].fill('nnn')
      await page.getByRole('button',{name:"Submit"}).click()
      await expect(page.getByText('Demo1 logged in successfully!')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button',{name:'Login'}).click()
      await expect(page.getByText('Username')).toBeVisible()
      const inputs= await page.getByRole('textbox').all();
      await inputs[0].fill('son7c_142')
      await inputs[1].fill('nnn2')
      await page.getByRole('button',{name:"Submit"}).click()
      await expect(page.getByText('Wrong Credentials')).toBeVisible()
    })
  })
})