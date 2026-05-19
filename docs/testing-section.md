# Testing

## 1. Introduction to Testing

Testing is a critical activity in web development because it verifies that the application behaves as intended under real usage conditions. A unified health portal must remain reliable and safe because users depend on it for healthcare discovery, authentication, and personal actions (such as saving favorites and submitting support requests). Testing helps identify functional defects early, improves usability, reduces runtime failures, and increases confidence before deployment.

**Objective of testing this website**

- Ensure all major user flows (navigation, search, authentication, dashboard access, favorites, support requests) work correctly end-to-end.
- Validate form inputs and error messages so users receive clear guidance.
- Confirm the UI is responsive, readable, and consistent across devices and browsers.
- Measure performance for page load, responsiveness, and overall user experience.
- Verify baseline security practices (authentication, authorization rules, input validation, and safe error handling).

## 2. Types of Testing Performed

### 2.1 Functional Testing

Functional testing was performed to confirm that each module performs its intended function. This included verifying routing, page navigation, authentication flows, search/filter actions, saving favorites, submitting support forms, and dashboard access control for authenticated users.

### 2.2 UI/UX Testing

UI/UX testing focused on layout consistency, readability, responsiveness, accessibility-aware design (labels, feedback messages, and button states), and user experience flow. Special attention was given to mobile and tablet viewports for navigation menus, cards, and form usability.

### 2.3 Performance Testing

Performance testing was performed to identify slow-loading pages and heavy assets. Metrics such as initial load, rendering responsiveness, and Lighthouse scores were reviewed to ensure smooth interaction and acceptable loading times.

### 2.4 Compatibility Testing

Compatibility testing ensured the portal works across multiple browsers and screen sizes. The portal was tested on common browsers and responsive breakpoints to confirm consistent rendering and behavior.

### 2.5 Security Testing

Security testing focused on the authentication and authorization workflow, safe handling of user inputs, and preventing unauthorized access to protected sections. Firestore access rules and client-side validation were checked to reduce risk of data exposure and misuse.

## 3. Test Cases Table

| Test Case ID | Description | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-FT-01 | Load Home Page and verify navigation links | Home page renders without errors; navbar links route correctly | As expected | Pass |
| TC-FT-02 | Register user with valid details | New user account is created and redirected to appropriate page | As expected | Pass |
| TC-FT-03 | Login with valid credentials | User is authenticated and can access protected dashboard | As expected | Pass |
| TC-FT-04 | Attempt login with invalid credentials | Proper error message is shown; user remains on login page | As expected | Pass |
| TC-FT-05 | Search and filter doctors/hospitals | Filtered list updates correctly based on selected criteria | As expected | Pass |
| TC-FT-06 | Add/remove favorites from listing and verify on Dashboard | Favorite state updates and persists; Dashboard reflects saved items | As expected | Pass |
| TC-FT-07 | Submit Support Request form with required fields | Ticket is created; success confirmation and/or ticket ID is shown | As expected | Pass |

## 4. Tools Used

- **Browser Developer Tools (Chrome/Edge)**: inspected console errors, network calls, storage, and layout issues.
- **Lighthouse (DevTools)**: evaluated performance, best practices, and accessibility indicators.
- **Manual Testing**: verified real user flows such as sign-up, login, search, form submissions, and protected routes.
- **Firebase Console (Auth/Firestore)**: verified authentication status, created users, and database documents written by the portal.

## 5. Bug Fixing / Issues Faced

Common issues observed during development and testing, along with resolutions:

1. **Authentication state not persisting after refresh**
   - **Issue:** Users were redirected to login after page reload due to delayed auth state initialization.
   - **Resolution:** Ensured the app waits for auth initialization before rendering protected routes and improved session persistence handling.

2. **Form validation messages not clear or inconsistent**
   - **Issue:** Some invalid inputs did not show user-friendly messages.
   - **Resolution:** Standardized validation rules (required fields, email format, password constraints) and displayed inline error text near the relevant input.

3. **Firestore permission / rule-related errors**
   - **Issue:** Writes to favorites/support collections failed under restrictive rules or missing user context.
   - **Resolution:** Updated Firestore rules and ensured authenticated user context is passed before performing write operations.

4. **Responsive layout issues on smaller screens**
   - **Issue:** Cards and buttons overlapped or overflowed on mobile viewports.
   - **Resolution:** Improved responsive styling with flexible layouts, spacing adjustments, and tested common breakpoints.

5. **Performance impact due to heavy assets and re-renders**
   - **Issue:** Some pages felt slower during navigation and filtering.
   - **Resolution:** Reduced unnecessary renders, improved component structure, and validated improvements using Lighthouse and DevTools.

## 6. Conclusion of Testing

Testing confirmed that the unified health portal is functionally stable and usable across typical devices and browsers. The primary user flows (authentication, search/filter, favorites, dashboard access, and support requests) were validated, key UI issues were resolved, and performance and compatibility checks improved confidence for deployment. Overall, the testing process reduced defects and ensured the portal provides a consistent and reliable experience for users.

## Snapshot Descriptions (Captions)

### Home Page

The screenshot shows the portal landing page with the main navigation and key entry points to explore healthcare services. It highlights the primary modules such as hospital/doctor discovery and health content, designed for quick access.

### Login/Register Page

The screenshot shows the authentication interface used to create a new account or log in to an existing account. It includes validated input fields and clear feedback messages for incorrect or missing details.

### Dashboard

The screenshot shows the protected dashboard visible after successful login. It summarizes the user’s activity such as saved favorites and provides quick access to authenticated features.

### Feature Page (Main Functionality)

The screenshot shows a core feature page (e.g., doctor/hospital search) where users can search, apply filters, and view result cards. It demonstrates how the portal supports healthcare discovery with structured listings and actionable controls.

### Error / Validation Messages

The screenshot shows validation feedback and error messages displayed during form interactions (such as login, signup, or support requests). It demonstrates how the system guides users to correct inputs and prevents invalid submissions.

