# Components

This directory contains all the reusable UI components for the Rangkai Edu frontend application.

## Structure

Components are organized into subdirectories based on their purpose:

- `layout/` - Layout components (Header, Sidebar, Footer, etc.)
- `ui/` - Generic UI components (Button, Card, Alert, etc.)
- `forms/` - Form components (Input, Select, etc.)
- `auth/` - Authentication-related components

## Naming Conventions

1. **Component Names**: Use PascalCase for component names (e.g., `Header`, `Button`, `Card`)
2. **File Names**: Component files should match the component name (e.g., `Header.jsx` contains the `Header` component)
3. **Directory Structure**: Components are grouped by type in appropriately named directories
4. **Props**: Components should accept props for customization and flexibility
5. **Styling**: Components should use Material-UI components as the base for consistent styling

## Component Guidelines

1. **Reusability**: Components should be generic and reusable across different parts of the application
2. **Props**: Components should clearly define their props using destructuring and default values
3. **Composition**: Components should be composable, allowing them to be used together to build more complex UIs
4. **Accessibility**: Components should follow accessibility best practices
5. **Documentation**: Components should be self-documenting through clear prop names and comments

## Available Components

### Layout Components
- `Header` - Application header with navigation and user controls
- `Sidebar` - Navigation sidebar with role-based menu items
- `Footer` - Application footer with copyright information

### UI Components
- `Button` - Extended Material-UI Button with consistent styling
- `Card` - Extended Material-UI Card with header, content, and actions
- `Alert` - Extended Material-UI Alert with title support
- `LoadingSpinner` - Loading indicator with optional message

### Form Components
- `Input` - Extended Material-UI TextField with consistent styling
- `Select` - Extended Material-UI Select with option support

### Authentication Components
- `ProtectedRoute` - Component for protecting routes based on authentication status and role authorization