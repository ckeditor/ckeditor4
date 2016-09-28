@bender-tags: 4.5.11, tc, 7154
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, sourcearea, toolbar, image2, link

## Link dialog integration

1. Click on image to focus it.
1. Use Link button.
	* Make sure Display Text field is **hidden**.
1. Put `foo` into URL.
1. Click OK button.

**Expected:** Following source `<p>An example image: <a href="http://foo"><img alt="alt" src="/tests//_assets/logo.png" /></a>.</p>`
 
## Restoring Display Text

1. Perform the above "Link dialog integration" TC.
1. Put selection on `example` word.
1. Use Link button.

**Expected:** Display Text field is visible.