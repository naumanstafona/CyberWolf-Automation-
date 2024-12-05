const { test, expect } = require("@playwright/test");

test("payment via card", async ({ browser }) => {
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
  await page.click("//p[normalize-space()='Jobs']");
  await page.locator("//td[normalize-space()='(544) 555-6551']").click();
  await page.click("//a[@id='job_in_items_tab']");
  await page.click("//a[normalize-space()='Add New Service']");
  await page.click("//textarea[@id='service']");
  await page.locator("//textarea[@id='service']").fill("carpet");
  await page.click("//input[@id='service_price']");
  await page.locator("//input[@id='service_price']").fill("7500");
  await page.click("//form[@id='add_service']//span[@role='presentation']");
  await page
    .locator(
      "//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']"
    )
    .fill("18.00");
  await page.keyboard.press("Enter");
  //await page.click("//li[@id='select2-service_tax_id-result-qsqn-42']")
  //await page.click("//h2[normalize-space()='Invoice Items']")
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
  await page.click("#invoice_service");
  await page.click(
    "//span[@id='select2-payment_type-container']/following-sibling::span[1]"
  );
  await page
    .locator(
      "//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']"
    )
    .fill("pay with card");
  await page.keyboard.press("Enter");
  await page.click("//button[@id='savePayment']");
  await page.locator("//input[@id='paywithcard_amt']").fill("146265")
  await page.locator("//input[@id='cardNumber']").fill("4242-4242-4242-4242")
  await page.locator("//input[@id='cardExpMonth']").fill("3")
  await page.locator("//input[@id='cardExpYear']").fill("2025")
  await page.locator("//input[@id='cardCVC']").fill("100")
  await page.locator("//input[@name='remember']").setChecked(true)
  await page.click("//button[@id='makeOnlinePayment']")
  //await page.click("//span[@aria-expanded='true']")
  await page.waitForTimeout(5000);
  //for ddeletion
  //await page.click('//a[@class="delete_service btn btn-danger table_action_btn delete-check" and @data-id="19418"]');
  await page.click('//a[@class="delete_service btn btn-danger table_action_btn delete-check" and @data-id="19423"]');
//a[@class="delete_service btn btn-danger table_action_btn delete-check" and @data-id="19424"]
  //await page.click("//div[@class='tooltip-inner']")
  await page.click("//button[normalize-space()='Delete']")
  await page.locator("//button[@type='button' and contains(@class, 'swal2-confirm') and contains(@class, 'swal2-styled')]").click()
  //await page.locator("//body/div[1]").click();
//   await page.click('//button[@class="swal2-confirm swal2-styled" and text()="OK"]');
 await page.keyboard.press("Enter");
  //await page.waitForTimeout(3000);

  await page.waitForLoadState("networkidle");
});
