const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");

test("create job and payment process full flow with auto-generated phone number and namee", async ({
  browser,
}) => {
  test.setTimeout(240000);

  // Helper function to generate a random phone number
  function generateRandomPhone() {
    const areaCode = Math.floor(Math.random() * 900) + 100; 
    const firstPart = Math.floor(Math.random() * 900) + 100; 
    const secondPart = Math.floor(Math.random() * 9000) + 1000; 
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  }
  
  function generateNewName() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return `${firstName} ${lastName}`;
  }

  const context = await browser.newContext({
    slowMo: 5000,
  });

  const page = await context.newPage();

  // Login
  await page.goto("https://dev.cyberwolfservice.com/login");
  await page.fill("#email", "fsm1@yopmail.com");
  await page.fill("#password", "PA44word@@");
  await page.click("button:has-text('Login')");

  // Navigate to 'Jobs' and create a new job
  await page.click("//p[normalize-space()='Jobs']");
  await page.click("a:has-text('Create New Job')");
  await page.locator("#client_name").fill(generateNewName());
  await page.locator("#phone").fill(generateRandomPhone());

  await page.locator("(//span[@id='select2-ctype-container'])[1]").click();
  await page.locator("(//input[@role='searchbox'])[2]").fill("Regular");
  await page.keyboard.press("Enter");

  await page.locator("//span[@id='select2-duration_days-container' and text()='1']").click();
  await page.locator("//li[@class='select2-results__option' and text()='4']").click();

  await page.locator("//span[@id='select2-jobTypeChange-container']").click();
  await page.locator("//li[contains(text(), 'painter')]").click();

  await page.locator("//span[@class='select2-selection__placeholder']").click();
  await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("05:00 AM-06:00 AM");
  await page.keyboard.press("Enter");

  const addressInput = page.getByRole("textbox", { name: "Search your address" });
  await addressInput.click();
  await addressInput.fill("Tampa International Airport");

  for (let i = 0; i < 5; i++) {
    try {
      await page.waitForSelector(".pac-item", { state: "visible", timeout: 2000 });
      const firstSuggestion = page.locator(".pac-item").first();
      await firstSuggestion.click();
      await page.waitForTimeout(1000);
      break;
    } catch (error) {
      console.log(`Attempt ${i + 1}: Retrying to find and click suggestion...`);
    }
  }

  await page.locator("//input[@id='send_form']").click();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);
  await page.click("//p[normalize-space()='Jobs']");
  await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();

  await page.waitForSelector('//a[@id="job_in_items_tab"]', {
    state: "visible",
    timeout: 5000,}) 
    await page.click("//a[@id='job_in_items_tab']");
     // Check if 'create_job_invoice' button is available
  const isInvoiceButtonVisible = await page.isVisible("//button[@id='create_job_invoice']",{timeout :5000});
  await page.waitForTimeout(4000);
  if (isInvoiceButtonVisible) {
    await page.waitForTimeout(4000);

    // If 'create_job_invoice' button is available, proceed with these steps
    await page.click("//button[@id='create_job_invoice']");
    
    // Click to add a new service
    await page.waitForTimeout(10000);
    await page.waitForSelector("//a[@data-target='#add_new_service']", { state: "visible", timeout: 20000 });
    await page.click("//a[@data-target='#add_new_service']");
    await page.locator("//textarea[@id='service']").fill("carpet");
    await page.locator("//input[@id='service_price']").fill("7500");

    await page.click("//form[@id='add_service']//span[@role='presentation']");
    await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("18.00");
    await page.keyboard.press("Enter");
    await page.click("#invoice_service");

    // Complete payment process
    await page.click("//span[@id='select2-payment_type-container']/following-sibling::span[1]");
    await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("pay with card");
    await page.keyboard.press("Enter");
    await page.click("//button[@id='savePayment']");
    await page.locator("//input[@id='paywithcard_amt']").fill("7500");
    await page.locator("//input[@id='cardNumber']").fill("4242-4242-4242-4242");
    await page.locator("//input[@id='cardExpMonth']").fill("3");
    await page.locator("//input[@id='cardExpYear']").fill("2025");
    await page.locator("//input[@id='cardCVC']").fill("100");
    await page.locator("//input[@name='remember']").setChecked(true);
    await page.click("//button[@id='makeOnlinePayment']");
    await page.waitForTimeout(5000);
      //  Delete a invoice

    await page.click("//a[@title='Delete Service']//i[@class='feather-trash-2'][1]");
    await page.click("//button[normalize-space()='Delete']");
    await page.click("//button[contains(@class, 'swal2-confirm') and text()='OK']");
    await page.locator("//a[contains(@class, 'delete_service')][1]").click();

    await page.waitForLoadState("networkidle");

  // Close the browser
    await browser.close();
  } else {
    // If 'create_job_invoice' button is not available, proceed to the alternative steps
    // await page.waitForSelector("//a[@data-target='#add_new_service']", { state: "visible", timeout: 20000 });
    // await page.click("//a[@data-target='#add_new_service']");
    // await page.locator("//textarea[@id='service']").fill("carpet");
    // await page.locator("//input[@id='service_price']").fill("7500");
    await page.waitForSelector("//a[@data-target='#add_new_service']", { state: "visible", timeout: 20000 });
    await page.click("//a[@data-target='#add_new_service']");
    await page.locator("//textarea[@id='service']").fill("carpet");
    await page.locator("//input[@id='service_price']").fill("7500");

    await page.click("//form[@id='add_service']//span[@role='presentation']");
    await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("18.00", { timeout: 5000 });
    await page.keyboard.press("Enter", { timeout: 5000 });

    await page.click("#invoice_service");

    // Complete payment process
    await page.click("//span[@id='select2-payment_type-container']/following-sibling::span[1]");
    await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("pay with card");
    await page.keyboard.press("Enter");
    await page.click("//button[@id='savePayment']");
    await page.locator("//input[@id='paywithcard_amt']").fill("7500");
    await page.locator("//input[@id='cardNumber']").fill("4242-4242-4242-4242");
    await page.locator("//input[@id='cardExpMonth']").fill("3");
    await page.locator("//input[@id='cardExpYear']").fill("2025");
    await page.locator("//input[@id='cardCVC']").fill("100");
    await page.locator("//input[@name='remember']").setChecked(true);
    await page.click("//button[@id='makeOnlinePayment']");
    await page.waitForTimeout(5000);
     
    //  Delete a invoice
  
    await page.click("//a[@title='Delete Service']//i[@class='feather-trash-2'][1]");
    await page.click("//button[normalize-space()='Delete']");
    await page.click("//button[contains(@class, 'swal2-confirm') and text()='OK']");
    await page.locator("//a[contains(@class, 'delete_service')][1]").click();

    await page.waitForLoadState("networkidle");

  // Close the browser
  await browser.close(); 
  }
});




test("create job and payment process full flow with auto-generated phone number and namew", async ({ browser }) => {
  test.setTimeout(240000);

  function generateRandomPhone() {
    const areaCode = Math.floor(Math.random() * 900) + 100; 
    const firstPart = Math.floor(Math.random() * 900) + 100; 
    const secondPart = Math.floor(Math.random() * 9000) + 1000; 
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  }
  
  function generateNewName() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return `${firstName} ${lastName}`;
  }

  const context = await browser.newContext({
    slowMo: 5000,
  });

  const page = await context.newPage();

  // Login
  await page.goto("https://dev.cyberwolfservice.com/login");
  await page.fill("#email", "fsm1@yopmail.com");
  await page.fill("#password", "PA44word@@");
  await page.click("button:has-text('Login')");

  // Navigate to 'Jobs' and create a new job
  await page.click("//p[normalize-space()='Jobs']");
  await page.click("a:has-text('Create New Job')");
  await page.locator("#client_name").fill(generateNewName());
  await page.locator("#phone").fill(generateRandomPhone());

  await page.locator("(//span[@id='select2-ctype-container'])[1]").click();
  await page.locator("(//input[@role='searchbox'])[2]").fill("Regular");
  await page.keyboard.press("Enter");

  await page.locator("//span[@id='select2-duration_days-container' and text()='1']").click();
  await page.locator("//li[@class='select2-results__option' and text()='4']").click();

  await page.locator("//span[@id='select2-jobTypeChange-container']").click();
  await page.locator("//li[contains(text(), 'painter')]").click();

  await page.locator("//span[@class='select2-selection__placeholder']").click();
  await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("05:00 AM-06:00 AM");
  await page.keyboard.press("Enter");

  const addressInput = page.getByRole("textbox", { name: "Search your address" });
  await addressInput.click();
  await addressInput.fill("Tampa International Airport");

  for (let i = 0; i < 5; i++) {
    try {
      await page.waitForSelector(".pac-item", { state: "visible", timeout: 2000 });
      const firstSuggestion = page.locator(".pac-item").first();
      await firstSuggestion.click();
      await page.waitForTimeout(1000);
      break;
    } catch (error) {
      console.log(`Attempt ${i + 1}: Retrying to find and click suggestion...`);
    }
  }

  await page.locator("//input[@id='send_form']").click();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);
  await page.click("//p[normalize-space()='Jobs']");
  await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();

  await page.waitForSelector('//a[@id="job_in_items_tab"]', {
    state: "visible",
    timeout: 5000,
  });
  await page.click("//a[@id='job_in_items_tab']");

  // Check for 'create_job_invoice' button
  let isInvoiceButtonVisible = false;
  try {
    await page.waitForSelector("//button[@id='create_job_invoice']", { state: "visible", timeout: 10000 });
    isInvoiceButtonVisible = true;
  } catch (error) {
    console.log("Create job invoice button not visible, proceeding to else block...");
  }

  if (isInvoiceButtonVisible) {
    await page.waitForTimeout(4000);

    // Steps if 'create_job_invoice' button is visible
    await page.click("//button[@id='create_job_invoice']");
    
    // Add a new service
    await page.waitForTimeout(10000);
    await page.waitForSelector("//a[@data-target='#add_new_service']", { state: "visible", timeout: 20000 });
    await page.click("//a[@data-target='#add_new_service']");
    await page.locator("//textarea[@id='service']").fill("carpet");
    await page.locator("//input[@id='service_price']").fill("7500");

    await page.click("//form[@id='add_service']//span[@role='presentation']");
    await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("18.00", { timeout: 5000 });
    await page.keyboard.press("Enter", { timeout: 5000 });
        await page.waitForTimeout(5000)

    try {
        const button = await page.$("//button[@id='invoice_service']");
        if (button) {
            await button.focus();
            await page.keyboard.press("Enter", { timeout: 5000 });
            console.log("Enter key pressed on the button.");
        } else {
            console.error("Button not found.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
    
    // await page.click("//button[@id='invoice_service']", { timeout: 5000 });
    // await page.keyboard.press("Enter", { timeout: 5000 });

    // Payment process
    await page.click("//span[@id='select2-payment_type-container']/following-sibling::span[1]");
    await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("pay with card");
    await page.keyboard.press("Enter");
    await page.click("//button[@id='savePayment']");
    await page.locator("//input[@id='paywithcard_amt']").fill("7500");
    await page.locator("//input[@id='cardNumber']").fill("4242-4242-4242-4242");
    await page.locator("//input[@id='cardExpMonth']").fill("3");
    await page.locator("//input[@id='cardExpYear']").fill("2025");
    await page.locator("//input[@id='cardCVC']").fill("100");
    await page.locator("//input[@name='remember']").setChecked(true);
    await page.click("//button[@id='makeOnlinePayment']");
    await page.waitForTimeout(5000);

    // Delete the invoice
    await page.click("//a[@title='Delete Service']//i[@class='feather-trash-2'][1]");
    await page.click("//button[normalize-space()='Delete']");
    await page.click("//button[contains(@class, 'swal2-confirm') and text()='OK']");
    await page.locator("//a[contains(@class, 'delete_service')][1]").click();

    await page.waitForLoadState("networkidle");

    // Close the browser
    await browser.close();
  } else {
    // Steps if 'create_job_invoice' button is not visible
    await page.waitForSelector("//a[@data-target='#add_new_service']", { state: "visible", timeout: 20000 });
    await page.click("//a[@data-target='#add_new_service']");
    await page.locator("//textarea[@id='service']").fill("carpet");
    await page.locator("//input[@id='service_price']").fill("7500");

    await page.click("//form[@id='add_service']//span[@role='presentation']");
    await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("18.00", { timeout: 5000 });
    await page.keyboard.press("Enter", { timeout: 5000 });
    await page.waitForTimeout(5000)
    try {
        const button = await page.$("//button[@id='invoice_service']");
        if (button) {
            await button.focus();
            await page.keyboard.press("Enter", { timeout: 5000 });
            console.log("Enter key pressed on the button.");
        } else {
            console.error("Button not found.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
    // await page.click("//button[@id='invoice_service']", { timeout: 5000 });
    // await page.keyboard.press("Enter", { timeout: 5000 });

    // Payment process
    await page.click("//span[@id='select2-payment_type-container']/following-sibling::span[1]");
    await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("pay with card");
    await page.keyboard.press("Enter");
    await page.click("//button[@id='savePayment']");
    await page.locator("//input[@id='paywithcard_amt']").fill("7500");
    await page.locator("//input[@id='cardNumber']").fill("4242-4242-4242-4242");
    await page.locator("//input[@id='cardExpMonth']").fill("3");
    await page.locator("//input[@id='cardExpYear']").fill("2025");
    await page.locator("//input[@id='cardCVC']").fill("100");
    await page.locator("//input[@name='remember']").setChecked(true);
    await page.click("//button[@id='makeOnlinePayment']");
    await page.waitForTimeout(5000);

    // Delete the invoice
    await page.click("//a[@title='Delete Service']//i[@class='feather-trash-2'][1]");
    await page.click("//button[normalize-space()='Delete']");
    await page.click("//button[contains(@class, 'swal2-confirm') and text()='OK']");
    await page.locator("//a[contains(@class, 'delete_service')][1]").click();

    await page.waitForLoadState("networkidle");

    // Close the browser
    await browser.close();
  }
});
