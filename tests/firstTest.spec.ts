import {test, expect} from '@playwright/test'

test.beforeEach('my first test', async({page})=> {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})


test('locator syntax rules', async ({page}) => {
    // Locate by tag name
    await page.locator('input').first().click()

    //by ID
    await page.locator('#inputEmail1').click()

    //by Class value
    page.locator('.shape-rectangle')

    //by Attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class ="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectora
    page.locator('input[placeholder="Email"][nbinput]')

    //by xPath
    page.locator('//*[id="inputEmail1]')

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')

})

test('User facing locators', async({page})=> {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    //await page.getByTitle('IoT Dashboard').click()

    await page.getByTestId('SignIn').click()
})

test('locating child elements', async({page})=> {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button', {name: "Sign In"}).first().click()
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent elements', async({page})=> {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()


    await page.locator('nb-card', {has: page.locator('nb-radio')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()




    await page.locator('nb-card').filter({hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('[class="appearance-filled size-medium shape-rectangle status-warning nb-transition"]')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()


    //preko x-patha one level up do parenta, ako ne stavimo parent element prvi
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()

})

test('Reusing the locators', async({page})=> {

    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailfield = basicForm.getByRole('textbox', {name: "Email"})

await emailfield.fill('test@test.com')
await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
await basicForm.locator('nb-checkbox').click()
await basicForm.filter({hasText: "Basic form"}).getByRole('button').click()

await expect(emailfield).toHaveValue('test@test.com')

})


test('extracting values', async({page})=> {
    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})

    const buttonText = await basicForm.locator('button').textContent()

    expect(buttonText).toEqual('Submit')


    //all text values - the list of values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name:"Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()

    expect(emailValue).toEqual('test@test.com')

    //by attribute value
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')

    
})


test('assertions', async({page})=> {


    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')


    //General assertions
    const value = 5
    expect(value).toEqual(5)

const text = await basicFormButton.textContent()
expect(text).toEqual('Submit')


//Locator assertion
await expect(basicFormButton).toHaveText('Submit')

//Soft Assertion je provjera koja NE prekida test odmah kad padne, nego test nastavlja dalje i greške se prijave tek na kraju testa.
await expect.soft(basicFormButton).toHaveText('Submit')
await basicFormButton.click()
})





