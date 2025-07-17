# Nuxt 3 Authentication with Local Database

This is a full-stack authentication starter project built with [Nuxt.js](https://nuxt.com/).

It provides a secure and complete authentication system out-of-the-box, including user registration, login, session management, and CSRF protection.

A key feature of this project is its use of a **local SQLite database**, managed through `unstorage` and `db0`. This makes the application entirely self-contained and incredibly easy to deploy. It leverages a pure JavaScript ecosystem for its database interactions, requiring no external database servers or complex drivers. The user data is stored in a simple `auth.sqlite` file within the `.data/` directory.

##  Features

-   **Secure User Registration**: 
-   **Session-based Authentication**: 
-   **Password Hashing**: Uses `bcrypt` to securely store user passwords.
-   **CSRF Protection**: 
-   **Account Recovery**: Generates a 24-word recovery phrase for users.
-   **SQLite Database**: Zero-setup, file-based database for user persistence.
-   **Modern Stack**: Built with Nuxt 3, Vue 3, and TypeScript.
-   **UI Components**: Styled with [Nuxt UI](https://ui.nuxt.com/).
