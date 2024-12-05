const { test, expect } = require("@playwright/test");
test("Hamza Test", async ({browser}) => {
    test.setTimeout(240000);
    // Create a new browser context with slowMo option
    const context = await browser.newContext({
        slowMo: 5000, // Adjust the delay in milliseconds (e.g., 1000 ms)
    });

    const page = await context.newPage();
    
})