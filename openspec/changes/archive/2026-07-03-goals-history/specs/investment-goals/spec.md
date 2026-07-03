## ADDED Requirements

### Requirement: Goal Records
The system SHALL persist investment goals as user-owned records instead of a single profile field.

#### Scenario: User has a target value
- **GIVEN** an authenticated user defines an investment target
- **WHEN** the target is saved
- **THEN** the value is stored as a goal record owned by that user
- **AND** the goal can be queried independently from the user's profile

### Requirement: Goal History
The system SHALL preserve goals after they are reached.

#### Scenario: Goal is reached
- **GIVEN** a user reaches an investment goal
- **WHEN** the goal is marked reached
- **THEN** the goal remains stored in history
- **AND** `reached_at` records when it was reached

### Requirement: Active Goal
The system SHALL identify the user's current active investment goal.

#### Scenario: User has active and reached goals
- **GIVEN** a user has one active goal and one or more reached goals
- **WHEN** the app needs the current target amount
- **THEN** it uses the active goal, not a reached historical goal

### Requirement: MVP Onboarding Goal Step
The system SHALL capture the user's total portfolio target as part of the initial macro onboarding flow.

#### Scenario: New user completes MVP onboarding
- **GIVEN** a user has created an account and selected macro allocations
- **WHEN** they continue onboarding
- **THEN** the app captures a total portfolio goal
- **AND** the app later captures how much the user already has in each selected macro

### Requirement: Existing Goal Migration
The system SHALL migrate existing profile target values into goal records.

#### Scenario: Existing profile has an investment goal
- **GIVEN** a profile has `investment_goal` greater than zero
- **WHEN** the goals migration runs
- **THEN** an active goal is created for that user with the same target value

### Requirement: Goal Access Control
The system SHALL restrict goal records to their owning user.

#### Scenario: Authenticated user queries goals
- **GIVEN** goals exist for multiple users
- **WHEN** an authenticated user reads, inserts, updates, or deletes goals
- **THEN** policies only allow access to rows where `user_id` belongs to that user

### Requirement: Goal Progress Summary
The system SHALL expose global goal progress for the active goal.

#### Scenario: User views portfolio progress
- **GIVEN** the user has an active goal and current macro values
- **WHEN** the app renders the portfolio summary
- **THEN** it shows how much is still missing overall to reach that goal
