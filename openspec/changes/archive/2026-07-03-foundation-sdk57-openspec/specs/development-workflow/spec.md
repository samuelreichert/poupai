## ADDED Requirements

### Requirement: OpenSpec Workflow
The project SHALL use OpenSpec as the durable source of truth for planned product and infrastructure changes.

#### Scenario: A feature branch begins
- **GIVEN** a planned non-trivial change such as auth, goals, or macro allocation logic
- **WHEN** work starts
- **THEN** the change is explored, proposed, implemented, and archived through OpenSpec artifacts

### Requirement: Expo SDK Baseline
The project SHALL keep its Expo packages aligned to the active SDK baseline before starting new MVP feature work.

#### Scenario: SDK baseline changes
- **GIVEN** Expo SDK 57 is the selected project baseline
- **WHEN** dependencies are installed or repaired
- **THEN** Expo packages are reconciled with the SDK 57-compatible versions using Expo tooling

### Requirement: Official Expo Skills
The project SHALL retain the official Expo AI skills as project-local guidance for Expo and React Native work.

#### Scenario: Expo-specific work is requested
- **GIVEN** a task involves Expo, Expo Router, EAS, native UI, native modules, or Expo SDK upgrades
- **WHEN** an AI agent works in the repository
- **THEN** the relevant project-local Expo skill from `.agents/skills` is available and referenced by `skills-lock.json`

### Requirement: Product Navigation Cleanliness
The app SHALL not expose SDK experiment/demo tabs in the product tab bar.

#### Scenario: User opens the app tabs
- **GIVEN** the app is running in the MVP product flow
- **WHEN** the native tab bar is displayed
- **THEN** only product tabs are available, with no SDK 56 demo tab
