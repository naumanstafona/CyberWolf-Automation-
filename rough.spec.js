const { test, expect } = require("@playwright/test");
test("Cyberwolfesssssay", async ({ browser }) => {
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
    await page.fill("#client_name", "fsm12");
    await page.locator("#phone").fill("(455) 478-9878");
  
    // Add a pause here before clicking on the dropdowns
    await page.pause();
  
    // Click on the 'ctype' dropdown and select 'Regular'
    await page.locator("(//span[@id='select2-ctype-container'])[1]").click();
    await page
      .locator(
        '//li[@class="select2-results__option" and @role="option" and text()="Regular"]'
      )
      .click();
  
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
    await page.locator("//span[@class='select2-selection__placeholder']").click();
    await page.locator("//span[@id='select2-jobTime-container']").click();
  
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
        await page.waitForTimeout(1000); // Wait before retrying
      }
    }
  
    await page.waitForLoadState("networkidle");
  });
  
  test("Cyberwolfesssssaya", async ({ browser }) => {
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
    await page.fill("#client_name", "fsm12");
    await page.locator("#phone").fill("(455) 478-9878");
  
    // Add a pause here before clicking on the dropdowns
    //await page.pause();
  
    // Click on the 'ctype' dropdown and select 'Regular'
    await page.locator("(//span[@id='select2-ctype-container'])[1]").click();
    await page.waitForSelector(
      '//li[@class="select2-results__option" and contains(text(), "Regular")]',
      { state: "visible" }
    );
    await page
      .locator(
        '//li[@class="select2-results__option" and contains(text(), "Regular")]'
      )
      .click();
  
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
  
    // Interact with additional dropdowns
    //   await page.locator("//span[@class='select2-selection__placeholder']").click();
    //   await page.locator("//span[normalize-space(text())='05:00 AM-06:00 AM']").click();
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
        //await page.waitForTimeout(1000); // Wait before retrying
      }
    }
    await page.locator("//input[@id='send_form']").click();
    await page.keyboard.press("Enter");
    await page.waitForLoadState("networkidle");
  });
  