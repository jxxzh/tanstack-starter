## ADDED Requirements
### Requirement: AlertDialog quick open helper
The system MUST provide a static helper to open a temporary AlertDialog without manual JSX composition, located outside the shared UI components directory in a dedicated helper file, and accept title (required), optional description, confirm/cancel labels (cancel optional), and separate confirm/cancel button variants with defaults.

#### Scenario: Open dialog with minimal options
- **WHEN** a caller invokes `AlertDialog.quickOpen`（或等效静态 API）传入标题、描述以及确认/取消文案与回调
- **THEN** a modal AlertDialog renders immediately using existing AlertDialog styles and semantics
- **AND** the helper returns a handle with `close()` to dismiss programmatically
- **AND** the temporary container unmounts and cleans event listeners/portals after confirm, cancel, or programmatic close
- **AND** default focus lands on the primary action unless the caller explicitly sets a different default action

#### Scenario: Async confirm with loading
- **WHEN** the caller provides an async confirm handler and triggers confirm
- **THEN** the confirm button enters a loading/disabled state until the promise settles
- **AND** on resolve, the dialog closes and the helper cleans up the temporary container and listeners
- **AND** on reject, the dialog remains open so the caller can handle errors, while clearing the loading state

