## MODIFIED Requirements

### Requirement: Active Goal
The system SHALL identify the user's nearest open investment goal for allocation calculations.

#### Scenario: User has open and reached goals
- **GIVEN** a user has one or more open goals and one or more reached goals
- **WHEN** the app needs the current target amount
- **THEN** it uses an open goal, not a reached historical goal

#### Scenario: User has open goals above current portfolio value
- **GIVEN** a user has multiple open goals
- **AND** at least one open goal has `target_value` greater than or equal to the current total portfolio value
- **WHEN** the app needs the current target amount
- **THEN** it uses the open goal with the smallest qualifying `target_value`

#### Scenario: User has no open goal above current portfolio value
- **GIVEN** a user has one or more open goals
- **AND** every open goal has `target_value` below the current total portfolio value
- **WHEN** the app needs the current target amount
- **THEN** it uses the open goal with the largest `target_value`

### Requirement: Goal Progress Summary
The system SHALL expose global goal progress for the nearest open goal.

#### Scenario: User views portfolio progress
- **GIVEN** the user has a nearest open goal and current macro values
- **WHEN** the app renders the portfolio summary
- **THEN** it shows how much is still missing overall to reach that goal

### Requirement: Goal Records
The system SHALL persist investment goals as user-owned records instead of a single profile field.

#### Scenario: User has a target value
- **GIVEN** an authenticated user defines an investment target
- **WHEN** the target is saved
- **THEN** the value is stored as an open goal record owned by that user
- **AND** the goal can be queried independently from the user's profile

### Requirement: Existing Goal Migration
The system SHALL migrate existing profile target values into goal records.

#### Scenario: Existing profile has an investment goal
- **GIVEN** a profile has `investment_goal` greater than zero
- **WHEN** the goals migration runs
- **THEN** an open goal is created for that user with the same target value

## ADDED Requirements

### Requirement: Open Goal Allocation Basis
The system SHALL calculate macro ideal values against the nearest open goal.

#### Scenario: Macro allocation uses selected goal
- **GIVEN** a user has selected macro percentages and current macro values
- **AND** the system has selected the nearest open goal
- **WHEN** macro allocation rows are calculated
- **THEN** each macro ideal value equals the selected goal target value multiplied by the macro ideal percentage
- **AND** each macro difference equals the ideal value minus the current macro value

### Requirement: Multiple Open Goals
The system SHALL allow a user to keep multiple open goals before they are reached.

#### Scenario: User has staged future targets
- **GIVEN** a user has several future portfolio targets
- **WHEN** the goals are stored
- **THEN** more than one goal can remain open for that user
- **AND** none of those open goals are removed when another goal is reached
