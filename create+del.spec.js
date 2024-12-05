const { test, expect } = require("@playwright/test");


test("Cybcreateplusdelete", async ({ browser }) => {
  // Create a new browser context with slowMo option
  const context = await browser.newContext({
    slowMo: 1000, // Adjust the delay in milliseconds (e.g., 1000 ms)
  });

  const page = await context.newPage();

  // Navigate to the login page
  await page.goto("https://dev.cyberwolfservice.com/login");

  // Log in
  await page.fill("#email", "fsm1@yopmail.com");
  await page.fill("#password", "PA44word@@");
  await page.click("button:has-text('Login')");

  // Go to the Jobs page and click 'Create New Job'
  await page.click("p:has-text('Jobs')");
  await page.click("a:has-text('Create New Job')");

  // Fill in client name
  await page.fill("#client_name", "yoesrrmtlyicm123");
  await page.locator("#phone").fill("(545) 468-4999");

  // Click on the 'ctype' dropdown and select 'Regular'
  await page.locator("(//span[@id='select2-ctype-container'])[1]").click();
  await page.locator("(//input[@role='searchbox'])[2]").fill("Regular");
  await page.keyboard.press("Enter");
  //   await page.waitForSelector(
  //     '//li[@class="select2-results__option" and contains(text(), "Regular")]',
  //     { state: "visible", timeout: 30000 }
  //   );
  //   await page
  //     .locator(
  //       '//li[@class="select2-results__option" and contains(text(), "Regular")]'
  //     )
  //     .click();
  //await page.locator("//li[@id='select2-ctype-result-ot4d-Regular']").click()
  // Select '4' in the 'duration_days' dropdown
  await page
    .locator("//span[@id='select2-duration_days-container' and text()='1']")
    .click();
  await page
    .locator("//li[@class='select2-results__option' and text()='4']")
    .click();

  // Click on 'jobTypeChange' dropdown and select 'painter'
  await page.locator("//span[@id='select2-jobTypeChange-container']").click();
  await page
    .locator(
      "//li[@class='select2-results__option' and contains(text(), 'painter')]"
    )
    .click();

  // Interact with the time dropdown and select "05:00 AM-06:00 AM"
  await page.locator("//span[@class='select2-selection__placeholder']").click();
  await page
    .locator(
      "//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']"
    )
    .fill("05:00 AM-06:00 AM");
  await page.keyboard.press("Enter");

  // Enter the address
  const addressInput = page.getByRole("textbox", {
    name: "Search your address",
  });
  await addressInput.click(); // Ensure input is focused
  await addressInput.fill("Tampa International Airport");

  // Attempt to select the first suggestion up to 5 times
  for (let i = 0; i < 5; i++) {
    try {
      await page.waitForSelector(".pac-item", {
        state: "visible",
        timeout: 2000,
      });
      const firstSuggestion = page.locator(".pac-item").first();
      await firstSuggestion.click();
      await page.waitForTimeout(1000);
      break;
    } catch (error) {
      console.log(`Attempt ${i + 1}: Retrying to find and click suggestion...`);
    }
  }

  // Submit the form
  await page.locator("//input[@id='send_form']").click();
  await page.keyboard.press("Enter");
  //await page.timeout(50000);
  await page.waitForLoadState("networkidle");
  await page.locator("//p[normalize-space()='Jobs']").click();
 //deleting first record uh have created
 await page.locator("(//tr[@class='odd']//div)[1]").click();
//   await page.evaluate(() => {
//     const checkbox = document.querySelector(
//       "//tbody/tr[1]//input[@type='checkbox']"
//     );
//     if (checkbox && !checkbox.checked) {
//       checkbox.checked = true;s
//     }
//   });

  //await page.locator("//tbody/tr[1]/td[1]/div/input[@type='checkbox']").click()
  await page.locator("//a[@id='delete_multiple_row']").click();
  await page.locator("//input[@id='reasonInput']").fill("test");
  await page.locator("//button[normalize-space()='Delete']").click();
  //await page.waitForTimeout(1000);
  await page.waitForLoadState("networkidle");
  // Wait for the OK button to appear and be visible

//   await page.evaluate(() => {
//     const okButton = document.querySelector("button[text='OK']");
//     if (okButton) {
//       okButton.click();
//     }
//   });
  
  await page.locator("//button[text()='OK']")
  //await page.locator("//button[text()='OK']").press("Enter")
  await page.keyboard.press("Enter");
  await page.waitForLoadState("networkidle");
  await page.locator("//div[@class='input-group input-group-same']//input[1]").click()
  await page.waitForTimeout(1000);
  await page.locator("//div[@class='input-group input-group-same']//input[1]").fill("yoesrrmtlyicm123")
  await page.keyboard.press("Enter");
  await page.waitForLoadState("domcontentloaded")

  await page.waitForLoadState("networkidle");
await page.locator("//h1[normalize-space()='All Jobs']").click()
  //await page.keyboard.press("Enter");


//   expect(
//     await page.locator("//h2[@class='swal2-title' and text()='Deleted!']")
//   );
  //await page.timeout(30000);
});

