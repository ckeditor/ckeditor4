@bender-tags: 4.11.0, feature, 2483
@bender-ckeditor-plugins: wysiwygarea, toolbar, colorbutton, language
@bender-ui: collapsed

1. Verify starting arrow position of the language and color buttons.

## Expected

Button icon and arrow are separated nicely.

## Unexpected

Button icon and arrow almost cling to each other.

2. Verify how `text color` button behaves after:

	* Hovering the button.
	* Clicking the button.
	* Disabling buttons using `disable` key above the editor.

## Expected

Arrow position didn't change.

## Unexpected

Visible flickering around the buttons.
