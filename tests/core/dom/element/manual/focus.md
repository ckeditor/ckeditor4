@bender-ui: collapsed
@bender-tags: 4.12.0, bug, 748

1. Press `Focus editable` button.

	## Expected:

	Scrollable element remains scrolled top.

	## Unexpected:

	- Scrollable element is scrolled down.
	- Editable is in view.

2. Slowly scroll down until you see nested scrollable.

## Expected:

- Nested scrollable is scrolled top.

## Unepxected:

- Nested scrollable is scrolled down.
- Editable is in view.
