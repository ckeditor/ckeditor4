@bender-tags: 4.16.1, 4611, bug
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, basicstyles, stylescombo, language

## On mobile device

1. Check if buttons have hover styles by long tapping on them and releasing the finger.

	### Expected result

	* There are hover styles **during** the tap (e.g. background becomes darker).
	* There aren't any hover styles **after** releasing the finger.

	### Unexpected result

	* There aren't any hover styles **during** the tap.
	* There are hover style (e.g. background became darker) **after** releasing the finger.

	Note: check if for both on and off buttons (e.g. by toggling "Bold").

2. Check if taping on buttons activate their active state.

	### Expected result

	Tapped button has active state (.e.g background became lighter or the button seems "pressed").

	### Unexpected result

	Tapped button does not have active state.

## On desktop

1. Check if buttons have hover styles.

	### Expected result

	There are hover styles (e.g. background became darker).

	### Unexpected result

	There aren't hover styles.

2. Check if clicking on buttons activate their active state.

	### Expected result

	Clicked button has active state (.e.g background became lighter).

	### Unexpected result

	Clicked button does not have active state.
