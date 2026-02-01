import {test, expect} from '@playwright/test'
import { timeout } from 'rxjs-compat/operator/timeout'

test.beforeEach(async({page}, testInfo)=> {
    await page.goto('http://uitestingplayground.com/ajax')
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
    
})


test('auto waiting', async({page})=> {
    const successButton = page.locator('.bg-success')
//     //await successButton.click()


//    // const text = await successButton.textContent()

//    await successButton.waitFor({state: "attached"})
//      const text = await successButton.allTextContents()


//     expect(text).toContain('Data loaded with AJAX get request.') // to contain jer je odg array,lista

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test('alternative waits', async({page})=> {
   const successButton = page.locator('.bg-success')

//    //1. ___wait for element
//    await page.waitForSelector('.bg-success')

   //2. ___wait for particular response
   await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

   //3. ___wait for network calls to be completed ("NOT RECOMMENDED")
    await page.waitForLoadState('networkidle')


    //4. wait for timeout (not recommended)
    await page.waitForTimeout(5000)

    //5. wait for url to be ready


//metoda koja nema waita po dokumentaciji - allTextContents
   const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.') // to contain jer je odg array,lista
})


test('timeouts', async({page})=> {
    
    //test.setTimeout(20000)  //ovo je za tetstimeout 

    test.slow() //ovo je kad znas da je sporo i povecas test timeout za 3x
    const successButton = page.locator('.bg-success')

    await successButton.click({timeout: 16000}) //ovo je action timeout
})