## MODIFIED Requirements

### Requirement: MVP Onboarding Goal Step
The system SHALL capture the user's total portfolio target after macro selection and ideal allocation, before current macro values are captured.

#### Scenario: New user completes MVP onboarding
- **GIVEN** a user has created an account, selected macros, and assigned ideal macro percentages
- **WHEN** they continue onboarding
- **THEN** the app captures a total portfolio goal greater than zero
- **AND** the app later captures how much the user already has in each selected macro
