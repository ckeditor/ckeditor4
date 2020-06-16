@bender-ui: collapsed
@bender-tags: 4.11.0, feature, 1815
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, link, autolink, undo

1. Focus the editor.
1. Type `http://example.com`.
1. Press listed commit key.
1. Double click on created link and check its `Link Type`.
1. Undo changes using `Undo` button.
1. Repeat for each commit key and ` mail@example.com ` text.

**Commit keys**:

* `Enter`
* `Space`

## Expected

* Typed text has been turned into a link with correct type i.e. `URL` for URL link and `E-mail` for email.
* Typed link should be removed on `Undo` button click in two steps:
	* undo link
	* undo typed text

## Unexpected

* Typed text has not been turned into a link or have invalid type.
* Typed link is not removed on `Undo` button click or it's removed in invalid order.
