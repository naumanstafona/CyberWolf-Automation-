const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const { timeout } = require("../playwright.config");
test("Update Payment Status ", async ({browser}) => {
    test.setTimeout(240000);

    // Helper function to generate a random phone number
    function generateRandomPhone() {
        const areaCode = Math.floor(Math.random() * 900) + 100; // Random 3-digit area code
        const firstPart = Math.floor(Math.random() * 900) + 100; // Random 3-digit prefix
        const secondPart = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit line number
        return `(${areaCode}) ${firstPart}-${secondPart}`;
    }

    // Helper function to generate a random name using Faker.js
    function generateNewName() {
        const firstName = "Automation";
        const lastName = faker.person.lastName();
        return `${firstName} ${lastName}`;
    }
      // Create a new browser context with slowMo option
      const context = await browser.newContext({
        slowMo: 5000, // Adjust the delay in milliseconds (e.g., 1000 ms)
    });

    const page = await context.newPage();

    // Navigate to the login page
    await page.goto("https://dev.cyberwolfservice.com/login");

    // Log in
    await page.fill("#email", "fsm1@yopmail.com");
    await page.fill("#password", "PA44word@@");
    await page.click("button:has-text('Login')");
    // Go back to Reports 
await page.click("//p[normalize-space()='Reports']");
await page.click("//a[@href='https://dev.cyberwolfservice.com/report/jobpaymentreport'][normalize-space()='View']");
await page.click("//tbody/tr[1]//td[position()=10]//ul/li/a/div/i[1]");
await page.click("//div[@class='dropdown-menu show']//a[@title='Update Payment Status'][normalize-space()='Update Payment Status']")
await page.click("//form[@name='update_payment_status_form']//span//b[@role='presentation']")
await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("Re")
await page.keyboard.press("Enter", { timeout: 3000 });
//await page.click("//li[@id='select2-payment_status_selector-result-rgx6-2']")
await page.click("//form[@name='update_payment_status_form']//button[@name='submit'][normalize-space()='Update']")
await page.waitForTimeout(5000);

})


test("Update Payment Status flow ", async ({browser}) => {
    test.setTimeout(240000);

    // Helper function to generate a random phone number
    function generateRandomPhone() {
        const areaCode = Math.floor(Math.random() * 900) + 100; // Random 3-digit area code
        const firstPart = Math.floor(Math.random() * 900) + 100; // Random 3-digit prefix
        const secondPart = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit line number
        return `(${areaCode}) ${firstPart}-${secondPart}`;
    }

    // Helper function to generate a random name using Faker.js
    function generateNewName() {
        const firstName = "Automation";
        const lastName = faker.person.lastName();
        return `${firstName} ${lastName}`;
    }
    async function addNewService(page, serviceName, servicePrice, taxValue) {
        await page.waitForTimeout(10000);
        await page.click("//a[@data-target='#add_new_service']");
        await page.locator("//textarea[@id='service']").fill(serviceName);
        await page.locator("//input[@id='service_price']").fill(servicePrice);
        await page.click("//form[@id='add_service']//span[@role='presentation']");
        await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill(taxValue);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(3000);
    }

      // Create a new browser context with slowMo option
      const context = await browser.newContext({
        slowMo: 5000, // Adjust the delay in milliseconds (e.g., 1000 ms)
    });

    const page = await context.newPage();

    // Navigate to the login page
    await page.goto("https://dev.cyberwolfservice.com/login");

    // Log in
    await page.fill("#email", "fsm1@yopmail.com");
    await page.fill("#password", "PA44word@@");
    await page.click("button:has-text('Login')");

    // Create a new job
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
    await page.locator("//input[@placeholder='Assign team member']").fill("ham");
    await page.waitForTimeout(2000);
    await page.locator("//li[@role='option']").click();

    await page.locator("#send_form").click();
    await page.click("//p[normalize-space()='Jobs']");
    await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();
    await page.click("//a[@id='job_in_items_tab']");
    await page.click("//button[@id='create_job_invoice']");
    await addNewService(page, "carpet", "9500", "18.00");

    await page.click("#invoice_service");
    await page.click("//span[@id='select2-payment_type-container']/following-sibling::span[1]");
    await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("pay with card");
    await page.keyboard.press("Enter");
    await page.click("//button[@id='savePayment']");

    await page.locator("#cardNumber").fill("4242-4242-4242-4242");
    await page.locator("#cardExpMonth").fill("3");
    await page.locator("#cardExpYear").fill("2025");
    await page.locator("#cardCVC").fill("100");
    await page.locator("//input[@name='remember']").setChecked(true);
    await page.click("//button[@id='makeOnlinePayment']");
    await page.waitForTimeout(3000);
    // Go back to Reports 
await page.click("//p[normalize-space()='Reports']");
await page.click("//a[@href='https://dev.cyberwolfservice.com/report/jobpaymentreport'][normalize-space()='View']");
await page.click("//tbody/tr[1]//td[position()=10]//ul/li/a/div/i[1]");
await page.click("//div[@class='dropdown-menu show']//a[@title='Update Payment Status'][normalize-space()='Update Payment Status']")
await page.click("//form[@name='update_payment_status_form']//span//b[@role='presentation']")
await page.locator("//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']").fill("Re")
await page.keyboard.press("Enter", { timeout: 3000 });
//await page.click("//li[@id='select2-payment_status_selector-result-rgx6-2']")
await page.click("//form[@name='update_payment_status_form']//button[@name='submit'][normalize-space()='Update']")
await page.waitForTimeout(5000);

})