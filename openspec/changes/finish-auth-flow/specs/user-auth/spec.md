## ADDED Requirements

### Requirement: Email Password Sign-In
The app SHALL let existing users sign in with email and password from a dedicated sign-in screen.

#### Scenario: Valid credentials create a session
- **GIVEN** a user enters valid credentials
- **WHEN** they submit the sign-in form
- **THEN** Supabase authenticates the user
- **AND** the existing auth gate routes the user to onboarding or tabs based on profile state

#### Scenario: Invalid credentials are rejected
- **GIVEN** a user enters invalid credentials
- **WHEN** they submit the sign-in form
- **THEN** the app shows a localized error message
- **AND** the user remains on the sign-in screen

### Requirement: Email Password Sign-Up
The app SHALL let new users create an account from a dedicated sign-up screen.

#### Scenario: User is created with an immediate session
- **GIVEN** Supabase returns a session after sign-up
- **WHEN** the sign-up completes
- **THEN** the existing auth gate routes the user to onboarding

#### Scenario: User must confirm email
- **GIVEN** Supabase creates the user but returns no session
- **WHEN** the sign-up completes
- **THEN** the app routes to a check-email screen
- **AND** the screen tells the user to confirm their email before signing in

### Requirement: Auth Form Validation
The app SHALL validate user-entered auth form data before sending it to Supabase.

#### Scenario: Missing or malformed data
- **GIVEN** the user submits missing email, malformed email, short password, or mismatched sign-up passwords
- **WHEN** the form is submitted
- **THEN** the app shows a localized validation message
- **AND** no Supabase auth request is sent

### Requirement: Auth Navigation
The auth flow SHALL provide clear navigation between sign-in, sign-up, and check-email states.

#### Scenario: User changes auth intent
- **GIVEN** a user is on an auth screen
- **WHEN** they choose the alternate action
- **THEN** the app navigates to the matching auth route without losing the app shell
