# Travel Agency Website

This is a Next.js-based website for a travel agency. It features a public-facing site for showcasing travel packages and articles, as well as a private admin panel for content management. The site is fully internationalized.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd travel-agency-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of the project and add the following environment variables:

    ```
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

    -   `MONGODB_URI`: The connection string for your MongoDB database. You can get one from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    -   `JWT_SECRET`: A secret key for signing JSON Web Tokens (JWTs) used for authentication. You can generate a strong secret using an online generator.

### Running the Application

-   **Development:** To run the application in development mode, use:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

-   **Production:** To build and run the application in production mode, use:
    ```bash
    npm run build
    npm run start
    ```

### Seeding the Database

The project includes a script to seed the database with an admin user and some sample articles. To run it, use:

```bash
npm run db:seed
```

This will:
- Create an admin user with the username `fonok` and password `abc123`. You will be required to change this password on your first login.
- Create two sample articles if the articles collection is empty.

## Project Structure

The project follows the standard Next.js App Router structure. Here's a brief overview of the key directories:

-   `src/app/[lang]`: The main public-facing pages of the application. The `[lang]` segment handles internationalization.
-   `src/app/fonok`: The admin panel for managing the site's content. "Főnök" is Hungarian for "boss".
-   `src/app/api`: The API routes for the application, handling things like authentication, and data fetching.
-   `src/components`: React components used throughout the application, separated into `public` and `admin` components.
-   `src/lib`: Helper functions and utilities, including the database connection logic (`dbConnect.js`).
-   `src/models`: Mongoose models for the database schemas (User, Article, Trip, SiteSettings).
-   `src/translations`: JSON files for internationalization (i18n). Each file corresponds to a language.
-   `src/middleware.js`: The middleware for handling route protection and language detection.

## Internationalization (i18n)

The application is multilingual. The language is determined by the URL (e.g., `/en/about`, `/de/ueber-uns`). The translations are stored in JSON files in the `src/translations` directory.

## Admin Panel

The admin panel is located at `/fonok`. You can log in with the admin user created by the seed script. The admin panel allows you to:

-   Manage articles
-   Manage trips
-   Update site settings

## Key Dependencies

-   [Next.js](https://nextjs.org/): The React framework for building the application.
-   [Mongoose](https://mongoosejs.com/): An ODM for interacting with the MongoDB database.
-   [Next-Auth](https://next-auth.js.org/): For authentication.
-   [TipTap](https://tiptap.dev/): A headless rich-text editor used in the admin panel.
-   [Tailwind CSS](https://tailwindcss.com/): For styling.

---

## User Documentation (Admin Guide)

This guide is for site administrators who manage the website's content and appearance.

### 1. Accessing the Admin Panel

-   Navigate to `http://yourdomain.com/fonok`.
-   Log in using the credentials provided. If this is the first time after seeding the database, the credentials are:
    -   **Username:** `fonok`
    -   **Password:** `abc123`
-   You will be required to change this password immediately upon your first login.

### 2. Managing Content

The admin panel sidebar allows you to manage different types of content:

-   **Dashboard:** Provides a quick overview of the site content.
-   **Trips:** Create, edit, or delete travel packages.
-   **Articles:** Create, edit, or delete articles for the blog.

When creating or editing trips and articles, you can use the language tabs at the top of the form to provide content in all supported languages.

### 3. Site-wide Settings

-   **Settings:** Update global information like the contact email, phone number, and physical address (with multilingual support).
-   **Styling:** Customize the look and feel of the public-facing website. You can change the primary color, background color, text color, and the fonts used for headers and body text.
-   **Appearance:** Change the overall layout for both the public site and the admin panel. The available themes are:
    -   **Default:** A standard multi-page layout.
    -   **Single Page:** Consolidates all content into a single, scrollable homepage.
    -   **Playful:** A more creative layout with a tilted sidebar.

---

## Developer Documentation

This section contains more in-depth technical information for developers working on the codebase.

### API Endpoints

The API is structured into three main categories under `src/app/api`:

-   `/api/auth`: Handles authentication, including login, logout, and password changes.
-   `/api/cms`: Content Management System routes for creating, updating, and deleting site content (trips, articles, settings). These routes are protected and require an authenticated session, which is enforced by `src/middleware.js`.
-   `/api/public`: Publicly accessible routes for fetching data needed by the front end, such as the list of articles or site settings.
-   `/api/uploads`: Handles file uploads from the rich text editor.

### Appearance & Theming System

The site's appearance is controlled by the `AppearanceContext` defined in `src/components/admin/AppearanceSettings.js`.

-   This context provides the current theme (`adminAppearance` and `publicAppearance`) to all components.
-   The `PublicLayoutClient` and `AdminLayoutClient` components consume this context to dynamically render the correct layout components (e.g., `Header`, `PlayfulHeader`, `SinglePage`).
-   The `initialPublicAppearance` is passed as a prop from the server-side layout (`src/app/[lang]/layout.js`) to the `AppearanceProvider` to prevent a flash of unstyled content on the public site.

### Internationalization (i18n)

The i18n system is straightforward:

-   The `[lang]` dynamic segment in the `src/app` directory captures the language from the URL.
-   The `middleware.js` file handles redirecting users to their preferred language or a default language if no language is specified in the URL.
-   Helper functions `getTranslations` and `getAdminTranslations` in `src/lib` dynamically import the correct JSON translation file from `src/translations` based on the current language.

### Adding a New Language

To add a new language (e.g., French 'fr'):

1.  **Update Component Constants:** Add the new language to the `languages` array in the following files:
    -   `src/components/public/LanguageSelector.js`
    -   `src/components/admin/ArticleForm.js`
    -   `src/components/admin/TripForm.js`
2.  **Add Currency (if applicable):** If the new language requires a new currency, add it to the `currencies`, `conversionRates`, and `priceFormatRules` constants in `src/components/admin/TripForm.js`.
3.  **Create Translation Files:**
    -   Create `fr.json` in `src/translations` for public-facing text.
    -   Create `admin_fr.json` in `src/translations` for admin panel text.
    -   Copy the contents from the `en` files and translate the values.
4.  **Update Translation Loaders:** Add the new language to the dynamic import map in:
    -   `src/lib/getTranslations.js`
    -   `src/lib/getAdminTranslations.js`
