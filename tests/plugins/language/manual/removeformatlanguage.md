@bender-tags: 4.7.3, bug, 779
@bender-ui: collapsed
@bender-ckeditor-plugins: wysiwygarea, toolbar, sourcearea, language, removeformat

**Scenario:**

1. Select some text and click `Language"` → `French`.
2. Click `Remove Format`.

**Expected result:**

The `span` element with language definition is not removed.

**Unexpected result:**

The `span` element with language definition is removed.
