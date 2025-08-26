import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Step 1: Navigate to the login page and log in
            await page.goto("http://localhost:3000/fonok")
            await page.wait_for_load_state('networkidle')
            await page.get_by_label("Username").fill("fonok")
            await page.get_by_label("Password").fill("abc123")
            await page.get_by_role("button", name="Sign in").click()

            # Step 2: Handle forced password change
            try:
                await expect(page.get_by_role("heading", name="Change Your Password")).to_be_visible(timeout=5000)
                print("Password change required, proceeding to change password.")
                await page.get_by_label("Current Password").fill("abc123")
                new_password = "new_password_123!"
                await page.get_by_label("New Password").fill(new_password)
                await page.get_by_label("Confirm New Password").fill(new_password)
                await page.get_by_role("button", name="Set New Password").click()
                await page.wait_for_load_state('networkidle')
                await expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()
                print("Password changed successfully.")
            except Exception:
                print("Password change page not found, assuming already changed.")


            # Step 3: Navigate to the styling page
            await page.goto("http://localhost:3000/fonok/styling")
            await page.wait_for_load_state('networkidle')
            await expect(page.get_by_role("heading", name="Appearance Settings")).to_be_visible()

            # Step 4: Set theme to 'default' and take screenshot
            await page.get_by_label("Theme selection").select_option("default")
            await page.get_by_role("button", name="Save Settings").click()
            await expect(page.locator("text=Settings saved successfully")).to_be_visible()
            await page.wait_for_timeout(1000) # wait for theme to apply
            await page.screenshot(path="jules-scratch/verification/default-theme.png")
            print("Took screenshot of default theme.")

            # Step 5: Set theme to 'playful' and take screenshot
            await page.get_by_label("Theme selection").select_option("playful")
            await page.get_by_role("button", name="Save Settings").click()
            await expect(page.locator("text=Settings saved successfully")).to_be_visible()
            await page.wait_for_timeout(1000) # wait for theme to apply
            await page.screenshot(path="jules-scratch/verification/playful-theme.png")
            print("Took screenshot of playful theme.")

        except Exception as e:
            print(f"An error occurred: {e}")
            await page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
