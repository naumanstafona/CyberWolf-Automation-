const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");

test("create job and payment process full flow", async ({ browser }) => {
  // Create a new browser context with slowMo option
  const context = await browser.newContext({
    slowMo: 1000, // Adjust the delay in milliseconds (e.g., 1000 ms)
  });

  const page = await context.newPage();

  // Navigate to the login page
  await page.goto("https://qa.cyberwolfservice.com/login");

  // Log in
  await page.fill("#email", "fsm1@yopmail.com");
  await page.fill("#password", "PA44word@@");
  await page.click("button:has-text('Login')");
  await page.waitForLoadState("networkidle");

  // Go to the Jobs page and click 'Create New Job'
  await page.click("//p[normalize-space()='Jobs']");
  await page.waitForSelector("a:has-text('Create New Job')");
  await page.click("a:has-text('Create New Job')");

  // Fill in client name and phone
  await page.fill("#client_name", "ftsthe1012");
  await page.locator("#phone").fill("(545) 482-3452");

  // Select 'Regular' in the 'ctype' dropdown
  await page.locator("(//span[@id='select2-ctype-container'])[1]").click();
  await page.locator("(//input[@role='searchbox'])[2]").fill("Regular");
  await page.keyboard.press("Enter");

  // Select '4' in the 'duration_days' dropdown
  await page
    .locator("//span[@id='select2-duration_days-container' and text()='1']")
    .click();
  await page
    .locator("//li[@class='select2-results__option' and text()='4']")
    .click();

  // Select 'painter' in the 'jobTypeChange' dropdown
  await page.locator("//span[@id='select2-jobTypeChange-container']").click();
  await page
    .locator(
      "//li[@class='select2-results__option' and contains(text(), 'painter')]"
    )
    .click();

  // Select "05:00 AM-06:00 AM" in time dropdown
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
  await addressInput.click();
  await addressInput.fill("Tampa International Airport");

  // Select the first address suggestion (up to 5 attempts)
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
  await page.locator("#send_form").click();
  await page.keyboard.press("Enter");
  await page.waitForLoadState("networkidle");

  // Re-navigate to 'Jobs' page and select the created job
  await page.click("//p[normalize-space()='Jobs']");
  await page.waitForSelector("(//td[text()='05:00 AM - 06:00 AM'])[1]");
  await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();

  // Wait and click on 'job_in_items_tab'
  await page.waitForSelector('//a[@id="job_in_items_tab"]', {
    state: "visible",
    timeout: 5000,
  });
  await page.click("//a[@id='job_in_items_tab']");
  await page.waitForSelector("//button[@id='create_job_invoice']", {
    state: "visible",
    timeout: 5000,
  });
  await page.click("//button[@id='create_job_invoice']");

  // Attempt to click 'Add New Service' with explicit retries
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(1000); // Delay before retrying
    const isAddServiceVisible = await page.isVisible(
      "//a[normalize-space()='Add New Service']"
    );

    if (isAddServiceVisible) {
      await page.click("//a[normalize-space()='Add New Service']");
      console.log("Successfully clicked on 'Add New Service'.");
      break;
    } else if (i === 4) {
      throw new Error(
        "Unable to click on 'Add New Service' after multiple attempts."
      );
    } else {
      console.log(
        `Attempt ${i + 1}: 'Add New Service' not visible, retrying...`
      );
    }
  }

  // Fill in service details
  await page.locator("#service").fill("carpet");
  await page.locator("#service_price").fill("7500");
  await page
    .locator("//form[@id='add_service']//span[@role='presentation']")
    .click();
  await page
    .locator(
      "//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']"
    )
    .fill("18.00");
  await page.keyboard.press("Enter");

  // Complete payment details
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
  await page.click("#savePayment");
  await page.locator("#paywithcard_amt").fill("146265");
  await page.locator("#cardNumber").fill("4242-4242-4242-4242");
  await page.locator("#cardExpMonth").fill("3");
  await page.locator("#cardExpYear").fill("2025");
  await page.locator("#cardCVC").fill("100");
  await page.locator("input[name='remember']").setChecked(true);
  await page.click("#makeOnlinePayment");

  // Wait and delete service
  await page.waitForTimeout(5000);
  await page.click(
    '//a[@class="delete_service btn btn-danger table_action_btn delete-check" and @data-id="19422"]'
  );
  await page.click("//button[normalize-space()='Delete']");
  await page
    .locator(
      "//button[@type='button' and contains(@class, 'swal2-confirm') and contains(@class, 'swal2-styled')]"
    )
    .click();

  await page.waitForLoadState("networkidle");
});





test("create job and payment process full flow with auto generted phone number and names", async ({
  browser,
}) => {
  test.setTimeout(240000);
  // Helper function to generate a random phone number
  function generateRandomPhone() {
    const areaCode = Math.floor(Math.random() * 900) + 100; // Random 3-digit area code
    const firstPart = Math.floor(Math.random() * 900) + 100; // Random 3-digit prefix
    const secondPart = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit line number
    return `(${areaCode}) ${firstPart}-${secondPart}`;
  }
  function generateNewName() {
    const firstName = faker.person.firstName();
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

  // Go to the Jobs page and click 'Create New Job'
  await page.click("//p[normalize-space()='Jobs']");
  await page.click("a:has-text('Create New Job')");

  // Fill in client name and random phone number

  await page.locator("#client_name").fill(generateNewName());
  await page.locator("#phone").fill(generateRandomPhone()); // Use the random phone number

  // Click on the 'ctype' dropdown and select 'Regular'
  await page.locator("(//span[@id='select2-ctype-container'])[1]").click();
  await page.locator("(//input[@role='searchbox'])[2]").fill("Regular");
  await page.keyboard.press("Enter");

  // Select duration
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
 

  await page.click("//p[normalize-space()='Jobs']");
  await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();

  await page.waitForSelector('//a[@id="job_in_items_tab"]', {
    state: "visible",
    timeout: 5000,
  });

  // Click on the 'job in items' tab
  await page.click("//a[@id='job_in_items_tab']");

  // Click on 'create invoice' button
  await page.click("//button[@id='create_job_invoice']");

  // Click to add a new service
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await page.waitForSelector("//a[@data-target='#add_new_service']", {
    state: "visible",
    timeout: 20000,
  });
  await page
    .locator("//a[@data-target='#add_new_service']", {
      state: "visible",
      timeout: 20000,
    })
    .click();

  await page
    .locator("//textarea[@id='service']")
    .fill("carpet", { timeout: 5000 }); // Timeout after 5 seconds
  await page
    .locator("//input[@id='service_price']")
    .fill("9500", { timeout: 5000 }); // Timeout after 5 seconds

  // Select tax dropdown and set value
  await page.click("//form[@id='add_service']//span[@role='presentation']", {
    timeout: 5000,
  }); // Timeout after 5 seconds
  await page
    .locator(
      "//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']"
    )
    .fill("18.00", { timeout: 5000 }); // Timeout after 5 seconds
  await page.keyboard.press("Enter", { timeout: 5000 }); // Timeout after 5 seconds
   await page.waitForTimeout(5000)
  // Select invoice item and payment method
  await page.click("#invoice_service");
  // Fill payment details
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
  
  //await page.locator("//input[@id='paywithcard_amt']").fill("8850");
  await page.locator("//input[@id='cardNumber']").fill("4242-4242-4242-4242");
  await page.locator("//input[@id='cardExpMonth']").fill("3");
  await page.locator("//input[@id='cardExpYear']").fill("2025");
  await page.locator("//input[@id='cardCVC']").fill("100");
  await page.locator("//input[@name='remember']").setChecked(true);
  await page.click("//button[@id='makeOnlinePayment']");
  await page.waitForTimeout(5000);
  await page.click("//a[@title='Delete Service']//i[@class='feather-trash-2'][1]");
  await page.click("//button[normalize-space()='Delete']")
  await page.waitForSelector("//button[contains(@class, 'swal2-confirm') and text()='OK']")
  await page.waitForLoadState("networkidle");


  // Capture the Job ID
const jobId = await page
.locator("//div[@class='icon-box header-title mt-2']/div[4]")
.textContent();

// Remove the '#' symbol if it exists
const cleanJobId = jobId.trim().replace('#', '');

// Log the cleaned Job ID
console.log(`Generated Job ID: ${cleanJobId}`);

// Navigate back to the Jobs page
await page.click("//p[normalize-space()='Jobs']");

// Use the captured Job ID to search for the job (without the '#' symbol)
const searchBox = page.locator("//input[@id='jobSubmitTableSearch']");
await searchBox.click();
await searchBox.fill(cleanJobId);
//await page.keyboard.press("Enter");
// await page.locator("(//input[@type='checkbox' and contains(@id, 'usersDataCheck')])[1]").click();
// Step 6: Locate and check the checkbox for the corresponding Job ID
const checkbox = page.locator(`//tr[td[text()='${cleanJobId}']]//input[@type='checkbox']`);
await checkbox.setChecked(true);
await page.locator("//a[@id='delete_multiple_row']").click();
await page.click("//input[@id='reasonInput']");
await page.locator("//input[@id='reasonInput']").fill("Test")
await page.click("//button[normalize-space()='Delete']");
await page.waitForSelector("//button[contains(@class, 'swal2-confirm') and text()='OK']");
await page.waitForLoadState("networkidle");


  //await page.keyboard.press("Enter");

  // Wait for results and ensure the page is idle
await page.waitForLoadState("networkidle");
console.log("Search completed for Job ID.");
await page.waitForTimeout(5000);

  // Close the browser
await browser.close();
});




test("create job and payment process full flow with auto generated phone number and names78", async ({ browser }) => {
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
    const firstName = faker.person.firstName();
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

  // Go to the Jobs page and click 'Create New Job'
  await page.click("//p[normalize-space()='Jobs']");
  await page.click("a:has-text('Create New Job')");

  // Fill in client name and random phone number
  await page.locator("#client_name").fill(generateNewName());
  await page.locator("#phone").fill(generateRandomPhone()); // Use the random phone number

  // Click on the 'ctype' dropdown and select 'Regular'
  await page.locator("(//span[@id='select2-ctype-container'])[1]").click();
  await page.locator("(//input[@role='searchbox'])[2]").fill("Regular");
  await page.keyboard.press("Enter");

  // Select duration
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

  // Navigate back to 'Jobs' page and select the created job
  await page.click("//p[normalize-space()='Jobs']");
  await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();

  await page.waitForSelector('//a[@id="job_in_items_tab"]', {
    state: "visible",
    timeout: 5000,
  });

  // Click on the 'job in items' tab
  await page.click("//a[@id='job_in_items_tab']");

  // Click on 'create invoice' button
  await page.click("//button[@id='create_job_invoice']");

  // Click to add a new service
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await page.waitForSelector("//a[@data-target='#add_new_service']", {
    state: "visible",
    timeout: 20000,
  });
  await page
    .locator("//a[@data-target='#add_new_service']", {
      state: "visible",
      timeout: 20000,
    })
    .click();

  await page
    .locator("//textarea[@id='service']")
    .fill("carpet", { timeout: 5000 }); // Timeout after 5 seconds
  await page
    .locator("//input[@id='service_price']")
    .fill("9500", { timeout: 5000 }); // Timeout after 5 seconds

  // Select tax dropdown and set value
  await page.click("//form[@id='add_service']//span[@role='presentation']", {
    timeout: 5000,
  }); // Timeout after 5 seconds
  await page
    .locator(
      "//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']"
    )
    .fill("18.00", { timeout: 3000 }); // Timeout after 5 seconds
  await page.keyboard.press("Enter", { timeout: 3000 }); // Timeout after 5 seconds
  await page.waitForTimeout(3000);

  // Select invoice item and payment method
  await page.click("#invoice_service");
  // Fill payment details
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

  // Fill payment card details
  await page.locator("//input[@id='cardNumber']").fill("4242-4242-4242-4242");
  await page.locator("//input[@id='cardExpMonth']").fill("3");
  await page.locator("//input[@id='cardExpYear']").fill("2025");
  await page.locator("//input[@id='cardCVC']").fill("100");
  await page.locator("//input[@name='remember']").setChecked(true);
  await page.click("//button[@id='makeOnlinePayment']");
  await page.waitForTimeout(3000);

  // Delete service
  await page.click("//a[@title='Delete Service']//i[@class='feather-trash-2'][1]");
  await page.click("//button[normalize-space()='Delete']");
  await page.waitForSelector("//button[contains(@class, 'swal2-confirm') and text()='OK']");
  await page.waitForLoadState("networkidle");

  // Capture the Job ID
  const jobId = await page
    .locator("//div[@class='icon-box header-title mt-2']/div[4]")
    .textContent();

  // Remove the '#' symbol if it exists
  const cleanJobId = jobId.trim().replace('#', '');

  // Log the cleaned Job ID
  console.log(`Generated Job ID: ${cleanJobId}`);

  // Navigate back to the Jobs page
  await page.click("//p[normalize-space()='Jobs']");

  // Use the captured Job ID to search for the job (without the '#' symbol)
  const searchBox = page.locator("//input[@id='jobSubmitTableSearch']");
  await searchBox.click();
  await searchBox.fill(cleanJobId);

  // Locate and check the checkbox for the corresponding Job ID
  const checkboxLocator = (await page.locator(`//tr[td[contains(text(), '${cleanJobId}')]]//input[@type='checkbox']`)).click();
  // await checkboxLocator.scrollIntoViewIfNeeded();  // Ensure the checkbox is in view
  // await checkboxLocator.setChecked(true);
// Proceed with deleting the job
await page.locator("//a[@id='delete_multiple_row']").click();
await page.click("//input[@id='reasonInput']");
await page.locator("//input[@id='reasonInput']").fill("Test");
await page.click("//button[normalize-space()='Delete']");
await page.waitForSelector("//button[contains(@class, 'swal2-confirm') and text()='OK']");
await page.waitForLoadState("networkidle");

// Wait for results and ensure the page is loaded
await page.waitForSelector("//p[normalize-space()='Jobs']", { timeout: 10000 });

});



test("create job and recall scenerio", async ({ browser }) => {
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
    const firstName = faker.person.firstName();
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

  // Go to the Jobs page and click 'Create New Job'
  await page.click("//p[normalize-space()='Jobs']");
  await page.click("a:has-text('Create New Job')");

  // Fill in client name and random phone number
  await page.locator("#client_name").fill(generateNewName());
  await page.locator("#phone").fill(generateRandomPhone()); // Use the random phone number

  // Click on the 'ctype' dropdown and select 'Regular'
  await page.locator("(//span[@id='select2-ctype-container'])[1]").click();
  await page.locator("(//input[@role='searchbox'])[2]").fill("Regular");
  await page.keyboard.press("Enter");

  // Select duration
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
  await page.locator("//input[@placeholder='Assign team member']").fill("ham");
  await page.waitForTimeout(2000);
  await page.locator("//li[@role='option']").click()
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

  // Navigate back to 'Jobs' page and select the created job
  await page.click("//p[normalize-space()='Jobs']");
  await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();

  await page.waitForSelector('//a[@id="job_in_items_tab"]', {
    state: "visible",
    timeout: 5000,
  });

  // Click on the 'job in items' tab
  await page.click("//a[@id='job_in_items_tab']");

  // Click on 'create invoice' button
  await page.click("//button[@id='create_job_invoice']");

  // Click to add a new service
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await page.waitForSelector("//a[@data-target='#add_new_service']", {
    state: "visible",
    timeout: 20000,
  });
  await page
    .locator("//a[@data-target='#add_new_service']", {
      state: "visible",
      timeout: 20000,
    })
    .click();

  await page
    .locator("//textarea[@id='service']")
    .fill("carpet", { timeout: 5000 }); // Timeout after 5 seconds
  await page
    .locator("//input[@id='service_price']")
    .fill("9500", { timeout: 5000 }); // Timeout after 5 seconds

  // Select tax dropdown and set value
  await page.click("//form[@id='add_service']//span[@role='presentation']", {
    timeout: 5000,
  }); // Timeout after 5 seconds
  await page
    .locator(
      "//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']"
    )
    .fill("18.00", { timeout: 3000 }); // Timeout after 5 seconds
  await page.keyboard.press("Enter", { timeout: 3000 }); // Timeout after 5 seconds
  await page.waitForTimeout(3000);

  // Select invoice item and payment method
  await page.click("#invoice_service");
  // Fill payment details
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

  // Fill payment card details
  await page.locator("//input[@id='cardNumber']").fill("4242-4242-4242-4242");
  await page.locator("//input[@id='cardExpMonth']").fill("3");
  await page.locator("//input[@id='cardExpYear']").fill("2025");
  await page.locator("//input[@id='cardCVC']").fill("100");
  await page.locator("//input[@name='remember']").setChecked(true);
  await page.click("//button[@id='makeOnlinePayment']");
  await page.waitForTimeout(3000);
  //navigate to job page
  await page.click("//p[normalize-space()='Jobs']");
  await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();
  await page.click("//input[@name='jo']")
  await page.click("//button[@id='child_job_create']")

  await page.click("//p[normalize-space()='Jobs']");
  await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();
  await page.waitForTimeout(3000);


})
test("Existing job recall", async ({ browser }) => {
  test.setTimeout(240000);
  const context = await browser.newContext({
    slowMo: 5000, // Adjust the delay in milliseconds (e.g., 1000 ms)
  });
  // Navigate to the login page
  await page.goto("https://dev.cyberwolfservice.com/login");

  // Log in
  await page.fill("#email", "fsm1@yopmail.com");
  await page.fill("#password", "PA44word@@");
  await page.click("button:has-text('Login')");
  await page.click("//p[normalize-space()='Jobs']");
  // await page.locator("(//td[text()='05:00 AM - 06:00 AM'])[1]").click();

// Locate all matching elements
const jobs = await page.locator("//td[contains(text(), 'AM') or contains(text(), 'PM')]");

// Get the count of matching elements
const jobCount = await jobs.count();

// Randomly select an index
const randomIndex = Math.floor(Math.random() * jobCount);

// Click on the randomly selected element
await jobs.nth(randomIndex).click();




})