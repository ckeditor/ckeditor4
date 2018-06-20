@bender-ui: collapsed
@bender-tags: 4.10.0, feature, 1815
@bender-ckeditor-plugins: clipboard, toolbar, wysiwygarea, link, autolink, undo

1. Focus the editor.
1. Type `http://example.com`.
1. Press `space`.
1. Double click on created link and check its `Link Type`.
1. Click `Undo` button once.
1. Repeat `1-5` with `http://example.com` and `enter`.

## Expected

* Typed text has been turned into a link with correct type i.e. `URL` for URL link and `E-mail` for email.
* Whole typed link should be removed on `Undo` button click.

## Unexpected

* Typed text has not been turned into a link or have invalid type.
* Typed link is not removed on `Undo` button click or requires more than single click.
