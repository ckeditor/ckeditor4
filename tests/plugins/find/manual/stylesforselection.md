@bender-tags: find, tc, 4.7.1, 14629
@bender-ui: collapsed
@bender-ckeditor-plugins: find, wysiwygarea, toolbar, sourcearea

## Scenario 1:

1. Open the `Find` dialog.
2. Type `example` into `Find what:` input.
3. Click `Find` button.
4. Click `Close` button.
5. Go to `Source`.

### Expected result:

HTML should look like this:

`<p>example text</p>`

### Unexpected result:

The word `example` has been wrapped in a `span` tag with `style="border-image:none;"` attribute:

`<p><span style="border-image:none;">example</span> text</p>`

---

#### Notes:

The bug used to be on IE11, Edge.

## Scenario 2:
1. Open the `Find` dialog.
2. Type `example` into `Find what:` input.
3. Click `Find` button.


### Expected result:

`example` word should be highlighted with red background and white font color.