@bender-tags: bug, 4.12.0, 2307
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea,toolbar,contextmenu,clipboard,language,notification

1. Perform following steps for `Language` menu button, and for context menu (you can use button under editor to open context menu).

1. Open menu.

	### Expected

	Notification appears with message: 'Menu show event fired'.

	### Unexpected

	Nothing happens.

1. Close menu by clicking somewhere else.

## Expected

Notification appears with message: 'Menu hide event fired'.

## Unexpected

Nothing happens.
