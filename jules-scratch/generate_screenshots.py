import time
from playwright.sync_api import sync_playwright

def read_file(path):
    with open(path, 'r') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w') as f:
        f.write(content)

def force_theme_and_screenshot(page, layout_file, theme, url, output_path):
    original_content = read_file(layout_file)
    try:
        # This is a brittle way to force the theme, but necessary for this task.
        # It finds the useAppearance hook and replaces its output.
        if "AdminLayoutClient.js" in layout_file:
            search_str = "const { appearance, isLoading } = useAppearance();"
            replace_str = f"const {{ appearance, isLoading }} = {{ appearance: '{theme}', isLoading: false }};"
        elif "PublicLayoutClient.js" in layout_file:
            search_str = "const { appearance, isLoading } = useAppearance();"
            replace_str = f"const {{ appearance, isLoading }} = {{ appearance: '{theme}', isLoading: false }};"
        else:
            raise ValueError("Unsupported layout file for theme forcing.")

        new_content = original_content.replace(search_str, replace_str)
        write_file(layout_file, new_content)

        # Give the dev server a moment to recompile
        time.sleep(5)

        page.goto(url, wait_until='networkidle')
        # Give animations time to settle
        time.sleep(2)

        # Specific actions for certain pages
        if theme == 'single-page' and 'en' in url:
            page.evaluate("window.scrollTo(0, 800);")
            time.sleep(1)

        page.screenshot(path=output_path)
        print(f"Successfully created screenshot: {output_path}")

    finally:
        # ALWAYS restore the original content
        write_file(layout_file, original_content)
        print(f"Restored original content of {layout_file}")
        time.sleep(3) # Give server time to recompile back

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login once to get the session cookie
    print("Logging in...")
    page.goto("http://localhost:3000/fonok")
    page.get_by_label("Username").fill("admin")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Sign in").click()
    page.wait_for_url("http://localhost:3000/fonok/dashboard")
    print("Login successful.")

    # --- Screenshot Generation ---
    themes = ["default", "single-page", "playful"]
    layouts = {
        "admin": "src/components/admin/AdminLayoutClient.js",
        "public": "src/components/public/PublicLayoutClient.js"
    }
    urls = {
        "admin": "http://localhost:3000/fonok/dashboard",
        "public": "http://localhost:3000/en"
    }

    for theme in themes:
        # Admin Screenshot
        force_theme_and_screenshot(
            page,
            layouts["admin"],
            theme,
            urls["admin"],
            f"public/img/theme-previews/admin-{theme}.png"
        )
        # Public Screenshot
        force_theme_and_screenshot(
            page,
            layouts["public"],
            theme,
            urls["public"],
            f"public/img/theme-previews/public-{theme}.png"
        )

    browser.close()
    print("Screenshot generation complete.")

with sync_playwright() as playwright:
    run(playwright)
