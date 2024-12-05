const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const { timeout } = require("../playwright.config");
test("Totel Payment before and after creating a job ", async ({browser}) => {
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

    // Reusable function to add a new service
    async function addNewService(page, serviceName, servicePrice, taxValue) {
        await page.waitForTimeout(10000);
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
            .fill(serviceName, { timeout: 5000 }); // Timeout after 5 seconds
        await page
            .locator("//input[@id='service_price']")
            .fill(servicePrice, { timeout: 5000 }); // Timeout after 5 seconds

        // Select tax dropdown and set value
        await page.click("//form[@id='add_service']//span[@role='presentation']", {
            timeout: 5000,
        });
        await page
            .locator(
                "//span[@class='select2-search select2-search--dropdown']//input[@role='searchbox']"
            )
            .fill(taxValue, { timeout: 3000 }); // Timeout after 3 seconds
        await page.keyboard.press("Enter", { timeout: 3000 });
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

    // Go to Reports and capture the initial total payment amount
    await page.click("//p[normalize-space()='Reports']");
    await page.click("//a[@href='https://dev.cyberwolfservice.com/report/jobpaymentreport'][normalize-space()='View']");
    await page.locator("//span[@id='total_collected_payment']").click()
    const initialTotalPayment = await page.locator("//span[@id='total_collected_payment']").allTextContents();
    console.log("Initial Total Payment:", initialTotalPayment);

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
    await page.locator("//li[@role='option']").click();
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
    await page.waitForTimeout(3000);
    await page.click("//button[@id='create_job_invoice']");

    // Use the reusable function to add a service
    await addNewService(page, "carpet", "9500", "18.00");

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
    await page.locator("//p[normalize-space()='Reports']").click();

    await page.click("//a[@href='https://dev.cyberwolfservice.com/report/jobpaymentreport'][normalize-space()='View']")
//totel payment "//span[@id='total_collected_payment']"

// Go back to Reports and capture the updated total payment amount
await page.click("//p[normalize-space()='Reports']");
await page.click("//a[@href='https://dev.cyberwolfservice.com/report/jobpaymentreport'][normalize-space()='View']");
await page.locator("//span[@id='total_collected_payment']").click()

const updatedTotalPayment = await page.locator("//span[@id='total_collected_payment']").allTextContents();
console.log("Updated Total Payment:", updatedTotalPayment);


})

