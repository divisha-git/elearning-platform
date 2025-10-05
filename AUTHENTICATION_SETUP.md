# Authentication Setup for eLearning Website

## Overview
The eLearning website now requires users to sign up or log in before accessing any content. This ensures that only authenticated users can access courses, quizzes, and other learning materials.

## Authentication Flow

### 1. Landing Page
- When users visit the website, they are redirected to `/auth` (Authentication Landing Page)
- This page provides both Sign In and Sign Up options in a tabbed interface
- Users must authenticate before accessing any protected content

### 2. Authentication Options
- **Sign In**: For existing users with email and password
- **Sign Up**: For new users with name, email, and password
- Both forms include validation and error handling

### 3. Protected Routes
All main content is now protected and requires authentication:
- Home page (`/`)
- About page (`/about`)
- Courses (`/courses` and all course sub-pages)
- Team page (`/team`)
- Testimonials (`/testimonial`)
- Contact page (`/contact`)
- Profile page (`/profile`)
- Quiz pages (`/test` and all quiz sub-pages)
- Library (`/library`)
- Feedback (`/feedback`)

### 4. User Experience
- After successful authentication, users are redirected to their intended destination
- Authentication state is persisted in localStorage
- Users can logout from the navbar
- The navbar shows user information when logged in

## Technical Implementation

### Components Created/Modified:
1. **AuthContext** (`src/contexts/AuthContext.jsx`)
   - Manages global authentication state
   - Provides login, register, logout functions
   - Handles token storage and validation

2. **ProtectedRoute** (`src/Components/ProtectedRoute.jsx`)
   - Guards routes that require authentication
   - Redirects unauthenticated users to auth page
   - Shows loading spinner during auth check

3. **AuthLanding** (`src/Components/Pages/AuthLanding.jsx`)
   - Beautiful landing page with tabbed interface
   - Handles both login and registration
   - Includes form validation and error handling

4. **Updated App.jsx**
   - Wrapped with AuthProvider
   - All routes protected with ProtectedRoute component
   - Legacy auth routes redirect to new auth landing

5. **Updated Navbar**
   - Uses AuthContext for state management
   - Shows user information when logged in
   - Provides logout functionality

### Backend Integration:
- Uses existing authentication API endpoints
- JWT token-based authentication
- Token stored in localStorage
- Automatic token validation

## Usage Instructions

### For Users:
1. Visit the website
2. You'll be redirected to the authentication page
3. Choose "Sign Up" if you're new, or "Sign In" if you have an account
4. Fill in the required information
5. After successful authentication, you'll be redirected to the main content
6. Use the navbar to access your profile or logout

### For Developers:
1. Ensure the backend server is running on port 5000
2. Start the frontend with `npm run dev`
3. The authentication flow will work automatically
4. All existing functionality remains the same for authenticated users

## Security Features:
- JWT token-based authentication
- Password validation (minimum 6 characters)
- Form validation and error handling
- Automatic token expiration handling
- Secure logout (clears all stored data)

## Testing:
1. Start both frontend and backend servers
2. Visit the website - you should be redirected to `/auth`
3. Try registering a new account
4. Try logging in with existing credentials
5. Verify that all protected routes require authentication
6. Test logout functionality
