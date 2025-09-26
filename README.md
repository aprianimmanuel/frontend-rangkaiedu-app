# Frontend App - Educational Platform

A responsive frontend application built with React and Vite for an educational platform. It provides user interfaces for teachers, parents, and students, including features like dashboards, grade books, login with role selection, and protected routes.

## Features

- User authentication via Google OAuth and Apple Sign-In
- Role-based access control (e.g., Teacher, Parent)
- Protected routes for authorized users only
- Dashboards for teachers (`DashboardGuru`) and parents (`PortalOrtu`)
- Grade book management (`BukuNilai`)
- OTP modal for verification
- API integration for data fetching

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

## Usage

After installation, run `npm run dev` to start the local server. Users can:

- Access the login page (`LoginPage.jsx`) and authenticate using Google or Apple.
- Select their role on the role selection page (`RoleSelection.jsx`).
- Navigate to role-specific pages like teacher dashboard, parent portal, or grade book.
- All sensitive pages are protected via `ProtectedRoute.jsx`.

For production builds, see the Development Setup section.

## Project Structure

```
frontend-app/
├── public/              # Static assets (e.g., vite.svg)
├── src/
│   ├── components/      # Reusable components (OtpModal.jsx, ProtectedRoute.jsx)
│   ├── contexts/        # Context providers (AuthContext.jsx)
│   ├── pages/           # Page components (BukuNilai.jsx, DashboardGuru.jsx, LoginPage.jsx, PortalOrtu.jsx, RoleSelection.jsx)
│   ├── utils/           # Utility modules (api.js, auth.js)
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # Entry point
│   ├── theme.js         # MUI theme configuration
│   ├── App.css          # Global styles
│   └── index.css        # Base styles
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint rules
└── README.md            # This file
```

## Dependencies

### Production
- [`react`](https://react.dev/) ^19.0.0 - UI library
- [`react-dom`](https://react.dev/) ^19.0.0 - React DOM renderer
- [`@mui/material`](https://mui.com/) ^5.16.7 - Material-UI components
- [`@emotion/react`](https://emotion.sh/docs/introduction) ^11.11.4 - Emotion for styling
- [`@emotion/styled`](https://emotion.sh/docs/styled) ^11.11.5 - Styled components
- [`@mui/icons-material`](https://mui.com/material-ui/material-icons/) ^5.16.7 - MUI icons
- [`@mui/lab`](https://mui.com/material-ui/lab/) ^5.0.0-alpha.185 - MUI lab components
- [`@mui/x-data-grid`](https://mui.com/x/react-data-grid/) ^7.2.0 - Data grid component
- [`react-router-dom`](https://reactrouter.com/) ^6.26.1 - Client-side routing
- [`axios`](https://axios-http.com/) ^1.7.7 - HTTP client for API calls
- [`@react-oauth/google`](https://www.npmjs.com/package/@react-oauth/google) ^0.12.1 - Google OAuth
- [`react-apple-signin-auth`](https://www.npmjs.com/package/react-apple-signin-auth) ^2.2.1 - Apple Sign-In

### Development
- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) - Vite React plugin
- [`eslint`](https://eslint.org/) - Linting
- TypeScript types via `@types/react` and `@types/react-dom`

Full list in [`package.json`](package.json).

## Development Setup

- **Run locally**: `npm run dev` (starts Vite dev server with hot module replacement)
- **Lint code**: `npm run lint` (uses ESLint for code quality)
- **Build for production**: `npm run build` (outputs to `dist/` folder, optimized for deployment)
- **Preview build**: `npm run preview` (serves the production build locally)
- **Testing**: No tests configured yet. To add, install Jest and React Testing Library:
  ```bash
  npm install --save-dev jest @testing-library/react @testing-library/jest-dom
  ```
  Then add scripts to `package.json` and configure.

Ensure Node.js >=18 and npm >=9 are installed.

## Contributing

1. Fork the project on GitHub.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit: `git commit -m 'Add your feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

Follow ESLint rules and add tests where applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (Note: Add a LICENSE file if not present.)

## Contact

Project maintained by [Your Name](mailto:your.email@example.com)  
Project Link: [https://github.com/yourusername/frontend-app](https://github.com/yourusername/frontend-app)
