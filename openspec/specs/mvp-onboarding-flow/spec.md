# mvp-onboarding-flow Specification

## Purpose
TBD - created by archiving change polish-mvp-onboarding-flow. Update Purpose after archive.
## Requirements
### Requirement: Step-Based Onboarding
The app SHALL guide new users through onboarding as ordered steps instead of one dense form.

#### Scenario: New user starts onboarding
- **GIVEN** an authenticated user has not completed macro allocation onboarding
- **WHEN** the onboarding screen is shown
- **THEN** the first step asks which macros the user wants to track

#### Scenario: User progresses through onboarding
- **GIVEN** the user has selected at least one macro
- **WHEN** they complete each onboarding step
- **THEN** the flow proceeds through ideal allocation, total goal, current values, and final save in that order

### Requirement: Macro Selection
The app SHALL let users choose which starter macros are included in their MVP portfolio.

#### Scenario: User selects macros
- **GIVEN** starter macros are available
- **WHEN** the user toggles macro selection
- **THEN** selected macros are included in the onboarding draft
- **AND** unselected macros are excluded from later allocation and value steps

#### Scenario: No macros selected
- **GIVEN** the user has not selected any macro
- **WHEN** they try to continue
- **THEN** the app keeps them on macro selection
- **AND** communicates that at least one macro is required

### Requirement: Ideal Allocation Step
The app SHALL capture ideal percentages only for selected macros.

#### Scenario: Selected macro percentages total 100 percent
- **GIVEN** the user has selected macros
- **WHEN** ideal percentages total 100%
- **THEN** the app allows the user to continue to the goal step

#### Scenario: Selected macro percentages do not total 100 percent
- **GIVEN** the user has selected macros
- **WHEN** ideal percentages are below or above 100%
- **THEN** the app keeps them on the allocation step
- **AND** shows how much is missing or over 100%

### Requirement: Goal Step
The app SHALL capture a positive total portfolio goal before current macro values.

#### Scenario: User enters valid goal
- **GIVEN** the user has completed macro allocation
- **WHEN** they enter a total goal greater than zero
- **THEN** the app allows the user to continue to current values

#### Scenario: User enters zero goal
- **GIVEN** the user is on the goal step
- **WHEN** the total goal is zero
- **THEN** the app keeps them on the goal step
- **AND** communicates that a goal greater than zero is required

### Requirement: Current Values Step
The app SHALL capture current values for selected macros before completing onboarding.

#### Scenario: User completes current values
- **GIVEN** selected macros exist
- **WHEN** the user enters current values for those macros
- **THEN** the app accepts zero or positive values
- **AND** saves the final macro plan

### Requirement: Onboarding Completion
The app SHALL route the user to the product tabs after the final onboarding save succeeds.

#### Scenario: Final save succeeds
- **GIVEN** the onboarding draft has selected macros, valid ideal percentages, a positive goal, and current values
- **WHEN** the final save succeeds
- **THEN** the app marks macro allocation onboarding complete through the existing save flow
- **AND** routes the user to the app tabs

#### Scenario: Final save fails
- **GIVEN** the onboarding draft is valid
- **WHEN** the final save fails
- **THEN** the app keeps the user in onboarding
- **AND** shows a localized retry message
