from playwright.sync_api import sync_playwright, expect, TimeoutError

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Log in
        page.goto("http://localhost:3000/fonok")
        page.wait_for_load_state('networkidle')

        username_input = page.get_by_label("Username")
        expect(username_input).to_be_visible(timeout=10000)
        username_input.fill("admin")

        page.get_by_label("Password").fill("password")
        page.get_by_role("button", name="Sign in").click()
        expect(page).to_have_url("http://localhost:3000/fonok/dashboard", timeout=10000)

        # Go to styling page
        page.goto("http://localhost:3000/fonok/styling")
        page.wait_for_load_state('networkidle')

        # Compact theme
        page.get_by_role("button", name="Compact").click()
        page.wait_for_timeout(1000) # wait for theme to apply
        page.screenshot(path="jules-scratch/verification/compact_theme.png")

        # Playful theme
        page.get_by_role("button", name="Playful").click()
        page.wait_for_timeout(1000) # wait for theme to apply
        page.screenshot(path="jules-scratch/verification/playful_theme.png")

        # Default theme
        page.get_by_role("button", name="Default").click()
        page.wait_for_timeout(1000) # wait for theme to apply
        page.screenshot(path="jules-scratch/verification/default_theme.png")

    except TimeoutError as e:
        print(f"Playwright script failed: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
