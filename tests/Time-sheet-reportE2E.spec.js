const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");
const { timeout } = require("../playwright.config");
test("Totel Payment before and after creating a job ", async ({browser}) => {
    test.setTimeout(240000);
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

    // Go to Reports 
    await page.click("//p[normalize-space()='Reports']");
    await page.click("//a[@class='btn lift btn-circle view-all-icon ']")
    await page.waitForTimeout(5000);
    //await page.click("//i[@class='feather-clock text-danger']")
    await page.click("//i[@class='text-danger feather-clock']")
    await page.click("//button[@id='address_saving_in']")
    //await page.click("//i[@class='text-danger feather-clock']")
    await page.waitForTimeout(10000);
    await page.click("//i[@class='feather-clock text-success']")
    await page.click("//button[@id='address_saving_out']")
    await page.click("//i[@class='feather-eye']")
    await page.click("//tr[contains(@class, 'even')]//i[contains(@class, 'feather-edit') and contains(@class, 'text-primary')]")

    await page.click("//div[@id='unavailability_date_picker2']//i[@class='fa fa-calendar']")
    // Wait for the calendar to load
    await page.waitForSelector("//td[@data-action='selectDay']");

    // Get today's date in the format 'MM/DD/YYYY'
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const [year, month, day] = todayString.split('-');
    const formattedToday = `${month}/${day}/${year}`; // Convert to MM/DD/YYYY

    // Find all available future dates
    const futureDates = await page.$$("td[data-action='selectDay']");

    for (const dateElement of futureDates) {
        const dateValue = await dateElement.getAttribute('data-day');

        if (dateValue && dateValue > formattedToday) {
            await dateElement.click();  // Click the first future date
            break;
        }
    }
    
     // Click the end time dropdown icon
     await page.click("(//b[@role='presentation'])[2]");

    // Wait for the dropdown options to load
    await page.waitForSelector("//li[contains(@class, 'select2-results__option')]");

    // Get all time options
    const endTimeOptions = await page.$$("li.select2-results__option");

    // Get the current time in "HH:MM AM/PM" format
    const currentTime = new Date();

    // Function to convert time string (HH:MM AM/PM) to Date object for comparison
    function convertToDate(timeString) {
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        // Convert to 24-hour format for comparison
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    // Filter future time options
    const futureTimeOptions = [];
    for (const option of endTimeOptions) {
        const optionText = await option.textContent();
        if (optionText) {
            const trimmedOptionText = optionText.trim();
            const optionDate = convertToDate(trimmedOptionText);

            // Only add to future times if the option time is in the future
            if (optionDate > currentTime) {
                futureTimeOptions.push(option);
            }
        }
    }

    // Select a random future time option if available
    if (futureTimeOptions.length > 0) {
        const randomIndex = Math.floor(Math.random() * futureTimeOptions.length);
        await futureTimeOptions[randomIndex].click();
    } else {
        console.log("No future time options available.");
    }
 
    await page.click("//button[@id='send_form1']")
    await page.waitForTimeout(5000);

     }

)





test.only("Total Payment before and after creating a jobw", async ({ browser }) => {
    test.setTimeout(240000);

    // Create a new browser context with slowMo option
    const context = await browser.newContext({
        slowMo: 5000, // Adjust the delay in milliseconds
    });

    const page = await context.newPage();

    // Navigate to the login page
    await page.goto("https://dev.cyberwolfservice.com/login");

    // Log in
    await page.fill("#email", "fsm1@yopmail.com");
    await page.fill("#password", "PA44word@@");
    await page.click("button:has-text('Login')");

    // Go to Reports
    await page.click("//p[normalize-space()='Reports']");
    await page.click("//a[@class='btn lift btn-circle view-all-icon ']");
    await page.waitForTimeout(5000);
    await page.click("//i[@class='text-danger feather-clock']");
    await page.click("//button[@id='address_saving_in']");
    await page.waitForTimeout(10000);
    await page.click("//i[@class='feather-clock text-success']");
    await page.click("//button[@id='address_saving_out']");
    await page.click("//i[@class='feather-eye']");
    await page.click("//tr[contains(@class, 'even')]//i[contains(@class, 'feather-edit') and contains(@class, 'text-primary')]");

    // Open calendar and select a future date
    await page.click("//div[@id='unavailability_date_picker2']//i[@class='fa fa-calendar']");
    await page.waitForSelector("//td[@data-action='selectDay']");

    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const [year, month, day] = todayString.split('-');
    const formattedToday = `${month}/${day}/${year}`; // MM/DD/YYYY

    const futureDates = await page.$$("td[data-action='selectDay']");

    for (const dateElement of futureDates) {
        const dateValue = await dateElement.getAttribute('data-day');

        if (dateValue && dateValue > formattedToday) {
            await dateElement.click();
            break;
        }
    }

     // Open the End Time dropdown
     await page.click("(//b[@role='presentation'])[2]");
     await page.waitForSelector("//li[contains(@class, 'select2-results__option')]");
 
     // Get the current time and format it for comparison
     const now = new Date();
     const currentHours = now.getHours();
     const currentMinutes = now.getMinutes();
 
     // Construct dynamic XPath for future time options (1-2 minutes ahead)
     let futureTimeXPath1 = `//li[contains(@class, 'select2-results__option') and contains(text(), '${formatTime(currentHours, currentMinutes + 1)}')]`;
     let futureTimeXPath2 = `//li[contains(@class, 'select2-results__option') and contains(text(), '${formatTime(currentHours, currentMinutes + 2)}')]`;
 
     // Function to format time in HH:MM AM/PM format
     function formatTime(hours, minutes) {
         if (minutes >= 60) {
             minutes -= 60;
             hours += 1;
         }
         const period = hours >= 12 ? 'PM' : 'AM';
         hours = hours % 12 || 12; // Convert to 12-hour format
         return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
     }
 
     // Try selecting the closest future time option
     try {
         if (await page.isVisible(futureTimeXPath1)) {
             await page.click(futureTimeXPath1);
         } else if (await page.isVisible(futureTimeXPath2)) {
             await page.click(futureTimeXPath2);
         } else {
             console.log("No suitable future time option available.");
         }
     } catch (error) {
         console.log("Error selecting future time option:", error);
     }

    
    // Submit the form
    await page.click("//button[@id='send_form1']");
    await page.waitForTimeout(5000);
});
